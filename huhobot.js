//LiteLoaderScript Dev Helper
/// <reference path="E:\\MCServer\\HelperLib\\src\\index.d.ts"/> 

const UPDATEURL = "https://release.huhobot.txssb.cn/lse/HuHoBot-BDS-{VERSION}.js"
const LATESTURL = "https://release.huhobot.txssb.cn/lse/latest.json"
const VERSION = "0.2.7"
const CONFIG_VERSION = 4
const PLUGINNAME = 'HuHoBot'
const PATH = `plugins/${PLUGINNAME}/`
const CONFIGPATH = `${PATH}config.json`
const BLOCKPATH = `${PATH}blockMsg.json`
const BDSALLOWLISTPATH = "allowlist.json"

var WebsocketObject = null

let callbackEvent = {
    run: {},
    runAdmin: {}
}


logger.setTitle(PLUGINNAME)

/**
 * 读取文件
 * @param {string} file 
 * @returns 
 */
function readFile(file) {
    try {
        return JSON.parse(File.readFrom(file))
    } catch (_) {
        logger.error("文件读取出错，请尝试清空数据")
        return {}
    }
}

/**
 * 写入文件
 * @param {string} file 
 * @param {Object} data 
 * @returns 
 */
function writeFile(file, data) {
    return File.writeTo(file, JSON.stringify(data, null, '\t'))
}

/**
 * 分割数组
 * @param {Array} array 
 * @param {number} itemsPerPage 
 * @returns 
 */
function paginateArray(array, itemsPerPage) {
    let pages = [];
    try {
        for (let i = 0; i < array.length; i += itemsPerPage) {
            pages.push(array.slice(i, i + itemsPerPage));
        }
    } catch (_) {
        pages.push("白名单解析出现异常,请管理员检查白名单")
    }

    return pages;
}

/**
 * 数组搜索关键词
 * @param {Array} array 需要查询的数组
 * @param {string} keyword 关键词
 * @param {boolean} caseInsensitive 是否进行大小写不敏感的搜索
 * @returns 
 */
function filterByKeyword(array, keyword, caseInsensitive = true) {
    // 使用filter方法查询包含关键词的元素
    return array.filter(item => {
        // 如果需要大小写不敏感的搜索，将item和keyword都转换为小写
        if (caseInsensitive) {
            return item.toLowerCase().includes(keyword.toLowerCase());
        } else {
            return item.includes(keyword);
        }
    });
}

/**
 * 注册一个回调事件
 * @param {"run"|"runAdmin"} callType 
 * @param {string} keyWord 
 * @param {string} nameSpace 
 * @param {string} funcName 
 * @returns boolean 是否注册成功
 */
function regCallbackEvent(callType, keyWord, nameSpace, funcName) {
    if (!ll.hasExported(nameSpace, funcName)) {
        return false;
    }
    let func = ll.imports(nameSpace, funcName);
    if (Object.keys(callbackEvent).indexOf(callType) == -1) {
        return false
    }
    if (Object.keys(callbackEvent[callType]).indexOf(keyWord) != -1) {
        return false
    }
    callbackEvent[callType][keyWord] = func;
    logger.info(`注册${callType}类型事件: 关键词(${keyWord}) 回调函数(${nameSpace}::${funcName}) 成功`)
    return true
}

class FWebsocketClient {
    constructor(name, log) {
        this.name = name;
        this.log = log;
        let WSC = new WSClient();
        this.WSC = WSC;
        WSC.Open = 0;
        WSC.Closing = 1;
        WSC.Closed = 2;
        this.isShakeHand = false;
        this.tryConnect = false;
        this.heart = null;

        //事件监听
        this.Events = {
            shaked: null,
            chat: null,
            success: null,
            add: null,
            delete: null,
            cmd: null,
            queryList: null,
            queryOnline: null,
            shutdown: null
        };

        this.autoReconnect = null;

        this.bindMap = {}

        this._InitMsgProcess();
    }

    /**
     * 连接服务器
     * @param {"nginx"|"direct"|"local"} connectLinkType 
     * @returns boolean 是否连接成功.
     */
    _Connect() {
        let isSuccess = this.WSC.connect(wsPath_Direct);
        if (isSuccess) {
            logger.info(`服务端连接成功!`);
            logger.info(`开始握手...`);
            this._sendShakeHand();
        } else {
            logger.error(`服务端连接失败,请检查后尝试手动重连.`);
        }
        return isSuccess;
    }

    /**
     * 重连服务器
     * @returns 
     */
    _ReConnect() {
        this._Close();
        let config = readFile(CONFIGPATH);
        this.name = config.serverName;
        let isSuccess = this._Connect();
        return new Promise((cBack, _cErr) => {
            cBack(isSuccess);
        });
    }

    /**
     * 断开与服务器连接
     * @returns 
     */
    _Close() {
        this.isShakeHand = false;
        this.tryConnect = false;
        if (this.WSC.status == this.WSC.Open) {
            return this.close(false);
        }
        return this.close(true);
    }

    /**
     * Websocket内置方法-设定监听消息
     */
    _InitMsgProcess() {
        let wsc = this.WSC;
        wsc.listen("onBinaryReceived", (data) => {
            logger.warn("客户端不支持Binary消息!自动断开!");
            this._Close();
        });
        wsc.listen("onError", (msg) => {
            logger.error(`WSC出现异常: ${msg}`);
            this._handleConnectionError();
        });

        wsc.listen("onLostConnection", (code) => {
            logger.warn(`WSC服务器连接丢失!CODE: ${code}`);
            let allowErrorCode = [1000];
            let forceReconnect = allowErrorCode.indexOf(code) >= 0;
            this._handleConnectionError(forceReconnect);
        });
        wsc.listen("onTextReceived", (msg) => {
            try {
                let json = JSON.parse(msg);
                //log(json)
                this._processMessage(json.header, json.body);
            } catch (_) {
                logger.error(_)
                logger.error(`WSC无法解析接收到的字符串!`);
                logger.info(`重新尝试连接...`);
                setTimeout(() => { this._ReConnect() }, 5 * 1000);
            }
        });
    }

    /**
     * 处理连接错误
     */
    _handleConnectionError(forceReconnect = false) {
        // 清除心跳定时器
        if (this.heart) {
            clearInterval(this.heart);
            this.heart = null;
        }

        if (!this.tryConnect && !forceReconnect) {
            logger.warn("当前已取消自动重连，请检查后手动使用/huhobot reconnect重连");
            return;
        }

        logger.info("正在尝试自动重连...");
        this._attemptReconnect();
    }

    /**
     * 自动重连
     */
    _attemptReconnect() {
        let reConnectCount = 0;
        const maxRetries = 5;
        const retryInterval = 5 * 1000; // 5秒

        const reConnect = () => {
            reConnectCount++;

            if (reConnectCount >= maxRetries) {
                logger.warn(`已尝试${maxRetries}次自动重连失败，请检查后输入/huhobot reconnect重连`);
                return;
            }

            setTimeout(() => {
                this._ReConnect().then((success) => {
                    if (!success) {
                        logger.warn(`第${reConnectCount}次重连失败，继续尝试...`);
                        reConnect();
                    }
                });
            }, retryInterval);
        };

        reConnect();
    }

    /**
     * 向服务器发送响应
     * @param {object} msg 
     * @param {Array} groupId 
     * @param {"success"|"error"} type 
     * @param {string} uuid 
     */
    _Respone(msg, groupId, type, uuid = "") {
        this._sendMsg(type, { msg: msg, group: groupId }, uuid)
    }

    /**
     * 运行事件
     * @param {"shaked"|"chat"|"success"|"add"|"delete"|"cmd"|"queryList"|"queryOnline"|"shutdown"} type 
     * @param {string} id 
     * @param {object} body 
     */
    _runEvent(type, id, body) {
        if (this.Events[type] == null) {
            throw new Error(`事件[${type}]不存在!`);
        }
        try {
            let res = this.Events[type](id, body);
        } catch (e) {
            logger.error(`在运行事件[${type}]时遇到错误: ${e}\n${e.stack}`);
            if (type != "shutdown") {
                logger.info(`正在重新连接...`);
                setTimeout(() => { this._ReConnect() }, 5 * 1000);
            }
        }
    }

    /**
     * 消息处理
     * @param {{"type":string,"id":string}} header 
     * @param {object} body 
     */
    _processMessage(header, body) {
        if (header.id == null) {
            logger.info(`收到特殊消息: ${body.msg}, 正在尝试重新连接...`);
            setTimeout(() => { this._ReConnect() }, 5 * 1000);
            return;
        }
        try {
            switch (header.type) {
                case "shaked": this.onShaked(header.id, body); break;
                case "chat": this.onChat(header.id, body); break;
                case "add": this.onAddAllowList(header.id, body); break;
                case "delete": this.onDelAllowList(header.id, body); break;
                case "cmd": this.onRunCmd(header.id, body); break;
                case "queryList": this.onQueryAllowList(header.id, body); break;
                case "queryOnline": this.onQueryOnline(header.id, body); break;
                case "shutdown": this.onShutDown(header.id, body); break;
                case "sendConfig": this.onSendConfig(header.id, body); break;
                case "run": this.onRun(header.id, body, header.type, false); break;
                case "runAdmin": this.onRun(header.id, body, header.type, true); break;
                case "bindRequest": this.onBindRequest(header.id, body, header.type); break;
            }
        } catch (e) {
            logger.error(`在处理消息是遇到错误: ${e.stack}`);
            logger.error(`此错误具有不可容错性!请检查插件是否为最新!`);
            logger.info(`正在断开连接...`);
            this._Close();
        }
    }

    _shakedProcess() {
        this.continueHeart = 0;
        this.isShakeHand = true;
        this.tryConnect = true;
        this.heart = setInterval(() => {
            this._sendMsg("heart", {})
        }, 5 * 1000)

        //记录时间自己重连
        this.autoReconnect = setTimeout(() => {
            logger.info("连接超时，尝试自动重连...")
            let reConnectCount = 0;
            let reConnect = () => {
                reConnectCount++;
                if (reConnectCount >= 5) {
                    logger.warn("已超过自动重连次数，请检查后输入/huhobot reconnect重连");
                } else {
                    setTimeout(() => {
                        this._ReConnect().then((code) => {
                            if (!code) {
                                logger.warn(`连接失败!重新尝试中...`);
                                reConnect();
                            }
                        });
                    }, 5 * 1000);

                }
            };
            reConnect();
        }, 6 * 60 * 60 * 1000)
    }

    /**
     * 发送消息
     * @param {"shaked"|"chat"|"success"|"add"|"delete"|"cmd"|"queryList"|"queryOnline"|"shutdown"} type 
     * @param {object} body 
     * @param {string} uuid 
     * @returns 
     */
    _sendMsg(type, body, uuid = system.randomGuid()) {
        if (this.WSC.status != 0 && this.isShakeHand) {
            //cb(null);
            return;
        }
        let response = {
            "header": {
                "type": type,
                "id": uuid
            },
            "body": body
        }
        let jsonStr = JSON.stringify(response);
        this.WSC.send(jsonStr);
    }

    /**
     * 向服务端握手
     */
    _sendShakeHand() {
        let config = readFile(CONFIGPATH)
        this._sendMsg(
            "shakeHand",
            {
                serverId: config.serverId,
                hashKey: config.hashKey,
                name: this.name,
                version: VERSION,
                platform: "bds"
            }
        );
    }

    /**
     * 回复消息
     * @param {string} msg 
     */
    _postChat(msg) {
        let serverId = readFile(CONFIGPATH).serverId
        this._sendMsg(
            "chat",
            {
                serverId: serverId,
                msg: msg
            }
        );
    }

    _bindConfirm(code) {
        let bindId = this.bindMap[code]
        this._sendMsg("bindConfirm", {}, bindId);
    }

    /**
     * 执行自定义命令
     * @param {string} id 
     * @param {object} body 
     * @param {string} type 
     */
    onBindRequest(id, body, type) {
        let bindCode = body.bindCode
        logger.info(`收到一个新的绑定请求，如确认绑定，请输入"/huhobot bind ${bindCode}"来进行确认`)
        this.bindMap[bindCode] = id
    }


    /**
     * 执行自定义命令
     * @param {string} id 
     * @param {object} body 
     * @param {string} type 
     * @param {boolean} isAdmin
     */
    onRun(id, body, type, isAdmin) {
        let keyWord = body.key;
        let params = body.runParams;

        //配置文件自定义命令
        let config = readFile(CONFIGPATH);
        let customCommand = config.customCommand;
        for (let i = 0; i < customCommand.length; i++) {
            let command = customCommand[i]
            if (command.key == keyWord) {
                //判断是否是管理员
                if (command.permission > 0 && !isAdmin) {
                    this._Respone(`权限不足，若您是管理员，请使用/管理员执行`, body.groupId, "error", id)
                    return;
                }
                //格式化参数
                let cmd = command.command;
                for (let j = 0; j < params.length; j++) {
                    let param = params[j]
                    cmd = cmd.replace(`&${j + 1}`, param)
                }
                //执行
                let outputCmd = mc.runcmdEx(cmd);
                if (outputCmd.success) {
                    this._Respone("执行成功:\n" + outputCmd.output, body.groupId, "success", id)
                } else {
                    this._Respone("执行失败:\n" + outputCmd.output, body.groupId, "error", id)
                }
                return;
            }
        }

        //插件自定义命令
        let data = JSON.stringify(body)
        if (Object.keys(callbackEvent[type]).indexOf(keyWord) != -1) {
            let ret = callbackEvent[type][keyWord](data)
            if (typeof ret === "string") {
                this._Respone(ret, body.groupId, "success", id)
            } else {
                throw new Error(`自定义命令返回值必须为字符串!`)
            }
            return;
        } else {
            let ret = (`未找到自定义命令:${keyWord}`)
            this._Respone(ret, body.groupId, "error", id)
        }



    }

    /**
     * 下发配置文件
     * @param {string} id 
     * @param {object} body 
     */
    onSendConfig(id, body) {
        //writeFile(CONFIGPATH, body);
        let serverId = body.serverId;
        let hashKey = body.hashKey;

        let config = readFile(CONFIGPATH);
        config.serverId = serverId
        config.hashKey = hashKey
        writeFile(CONFIGPATH, config);

        this._Respone(`服务器已接受下发配置文件`, body.groupId, "success", id)
        logger.info(`服务器已接受下发配置文件，正在自动重连，若重连失败请重启服务器`)
        logger.info(`正在重新连接...`);
        setTimeout(() => { this._ReConnect() }, 5 * 1000);
    }

    /**
     * 握手成功
     * @param {string} id 
     * @param {object} body 
     */
    onShaked(id, body) {
        let code = body.code;
        switch (code) {
            case 1:
                logger.info(`握手完成!`);
                this._shakedProcess();
                break;
            case 2:
                logger.info(`握手完成!,附加消息:${body.msg}`);
                this._shakedProcess();
                break;
            case 3:
                logger.error(`握手失败!原因: ${body.msg}`);
                this.tryConnect = false;
                break;
            case 4:
                logger.error(`握手失败!原因: ${body.msg}`);
                logger.info(`正在尝试更新到最新版本...`)
                updateVersion();
                this.tryConnect = false;
                break;
            case 6:
                logger.info(`握手完成,等待绑定....`);
                this._shakedProcess()
                let config = readFile(CONFIGPATH)
                if (config.hashKey == null || config.hashKey == '') {
                    logger.warn(`服务器尚未在机器人进行绑定，请在群内输入"/绑定 ${config.serverId}"来绑定`)
                }
                break;
            default:
                logger.error(`握手失败!原因: ${body.msg}`);
        }
    }

    /**
     * 聊天信息
     * @param {string} id 
     * @param {object} body 
     */
    onChat(id, body) {
        let config = readFile(CONFIGPATH)
        if (!config.chatFormat.post_chat) return; // 总开关关闭时不处理

        let chatMsg = "群:<{nick}> {msg}"
        if (config.chatFormat) {
            chatMsg = config.chatFormat.group
                .replace("{nick}", body.nick)
                .replace("{msg}", body.msg);
        }

        mc.broadcast(chatMsg)
    }

    /**
     * 添加白名单请求
     * @param {string} id 
     * @param {object} body 
     */
    onAddAllowList(id, body) {
        let outputAdd = mc.runcmdEx(`allowlist add ${body.xboxid}`)
        if (outputAdd.success) {
            this._Respone(`${this.name}已接受添加名为${body.xboxid}的白名单请求\n返回如下:${outputAdd.output}`, body.groupId, "success", id)
        } else {
            this._Respone(`${this.name}已拒绝添加名为${body.xboxid}的白名单请求\n返回如下:${outputAdd.output}`, body.groupId, "error", id)
        }
    }

    /**
     * 删除白名单请求
     * @param {string} id 
     * @param {object} body 
     */
    onDelAllowList(id, body) {
        let outputDel = mc.runcmdEx(`allowlist remove ${body.xboxid}`);
        if (outputDel.success) {
            this._Respone(`${this.name}已接受删除名为${body.xboxid}的白名单请求\n返回如下:${outputDel.output}`, body.groupId, "success", id)
        } else {
            this._Respone(`${this.name}已拒绝删除名为${body.xboxid}的白名单请求\n返回如下:${outputDel.output}`, body.groupId, "success", id)
        }

    }

    /**
     * 执行命令请求
     * @param {string} id 
     * @param {object} body 
     */
    onRunCmd(id, body) {
        let outputCmd = mc.runcmdEx(body.cmd);
        if (outputCmd.success) {
            this._Respone("执行成功:\n" + outputCmd.output, body.groupId, "success", id)
        } else {
            this._Respone("执行失败:\n" + outputCmd.output, body.groupId, "error", id)
        }
    }

    /**
     * 查询白名单请求
     * @param {string} id 
     * @param {object} body 
     */
    onQueryAllowList(id, body) {
        let BDSAllowlist = {}
        try {
            BDSAllowlist = readFile(BDSALLOWLISTPATH)
        } catch (err) {
            logger.error("读取白名单文件失败,请检查白名单文件是否正确!")
            logger.error(err)
            this._sendMsg("queryWl", { "list": "读取白名单文件失败,请检查白名单文件是否正确!" }, id)
            return;
        }

        let nameList = []
        for (let i = 0; i < BDSAllowlist.length; i++) {
            nameList.push(BDSAllowlist[i]["name"]);
        }

        if ('key' in body) {
            if (body.key.length < 2) {
                let allowlistNameString = `查询白名单关键词:${body.key}结果如下:\n`
                allowlistNameString += '请使用两个字母及以上的关键词进行查询!'
                this._sendMsg("queryWl", { "list": allowlistNameString }, id)
                return;
            }
            let allowlistNameString = `查询白名单关键词:${body.key}结果如下:\n`
            let filterList = filterByKeyword(nameList, body.key)
            if (filterList.length == 0) {
                allowlistNameString += '无结果'
            } else {
                for (let i = 0; i < filterList.length; i++) {
                    allowlistNameString += filterList[i] + "\n";
                }
                allowlistNameString += `共有${filterList.length}个结果`
            }

            this._sendMsg("queryWl", { "list": allowlistNameString }, id)
        }
        else if ('page' in body) {
            let allowlistNameString = "服内白名单如下:\n"
            let splitedNameList = paginateArray(nameList, 10)
            let firstNameList = splitedNameList[body.page - 1]
            if (body.page - 1 > splitedNameList.length) {
                allowlistNameString += `没有该页码\n`
                allowlistNameString += `共有${splitedNameList.length}页\n请使用/查白名单 {页码}来翻页`
            } else {
                for (let i = 0; i < firstNameList.length; i++) {
                    allowlistNameString += firstNameList[i] + "\n";
                }
                allowlistNameString += `共有${splitedNameList.length}页，当前为第${body.page}页\n请使用/查白名单 {页码}来翻页`
            }

            this._sendMsg("queryWl", { "list": allowlistNameString }, id)
        }
        else {
            let allowlistNameString = "服内白名单如下:\n"
            let splitedNameList = paginateArray(nameList, 10)
            let firstNameList = splitedNameList[0]
            for (let i = 0; i < firstNameList.length; i++) {
                allowlistNameString += firstNameList[i] + "\n";
            }
            allowlistNameString += `共有${splitedNameList.length}页，当前为第${1}页\n请使用/查白名单 {页码}来翻页`
            this._sendMsg("queryWl", { "list": allowlistNameString }, id)
        }

    }

    /**
     * 查询在线列表请求
     * @param {string} id 
     * @param {object} body 
     */
    onQueryOnline(id, body) {
        let config = readFile(CONFIGPATH)

        let server_ip = config.motd.server_ip;
        let server_port = config.motd.server_port;
        let api = config.motd.api;
        let text = config.motd.text
        let output_online_list = config.motd.output_online_list;
        let post_img = config.motd.post_img;

        //拼接在线列表
        let onlineNameString = ""
        let online = mc.getOnlinePlayers();
        if (output_online_list) {
            for (let i = 0; i < online.length; i++) {
                let simulated = ""
                if (online[i].isSimulatedPlayer() && config.addSimulatedPlayerTip) {
                    simulated = "(假人)"
                }
                onlineNameString += online[i].name + simulated;
                onlineNameString += "\u200B"
            }
        }
        text = text.replace("{online}", online.length)
        onlineNameString += text

        this._sendMsg("queryOnline", {
            "list": {
                "msg": onlineNameString,
                "url": `${server_ip}:${server_port}`,
                "imgUrl": api.replace("{server_ip}", server_ip).replace("{server_port}", server_port),
                "post_img": post_img,
                "serverType": "bedrock",
            }
        }, id)
    }

    /**
     * 服务端断开连接
     * @param {string} id 
     * @param {object} body 
     */
    onShutDown(id, body) {
        this.tryConnect = false
        logger.error(`服务端命令断开连接 原因:${body.msg}`);
        logger.error(`此错误具有不可容错性!请检查插件配置文件!`);
        logger.info(`正在断开连接...`);
        this._Close();
    }

    /**
     * 监听事件
     * @param {"shaked"|"chat"|"success"|"add"|"delete"|"cmd"|"queryList"|"queryOnline"|"shutdown"|"bindRequest"} event 
     * @param {(id: string, body: object)=>{}} func 
     * @returns 
     */
    listen(event, func) {
        if (this.Events[event] == null) {
            this.Events[event] = func;
        } else {
            throw new Error(`重复监听事件${event}`)
        }

        return true;
    }

    /**
     * 关闭客户端连接
     * @param {boolean} bool 
     * @returns 
     */
    close(bool = false) {
        this.isShakeHand = false;
        if (!bool) {
            return this.WSC.close();
        }
        return true;
    }
}

/**
 * 初始化WebSocket服务
 */
function initWebsocketServer() {
    let config = readFile(CONFIGPATH)
    let ws = new FWebsocketClient(config.serverName, logger,)
    logger.info(`正在连接${PLUGINNAME}服务端...`)
    ws._Connect();
    return ws;
}

/**
 * 注册命令
 * @param {FWebsocketClient} ws 
 */
function regCommand(ws) {
    const cmd = mc.newCommand("huhobot", `${PLUGINNAME}管理`, PermType.Any);
    cmd.setEnum("NormalAction", ["reconnect", "close", "help","update"]);
    cmd.setEnum("BindAction", ["bind"])
    cmd.mandatory("action", ParamType.Enum, "NormalAction", 1);
    cmd.mandatory("action", ParamType.Enum, "BindAction", 1);
    cmd.mandatory("bindcode", ParamType.RawText);
    cmd.overload(["NormalAction"]);
    cmd.overload(["Bind", "bindcode"]);
    cmd.overload([]);


    cmd.setCallback((_cmd, _ori, out, res) => {
        let type = res.action
        switch (type) {
            case "reconnect":
                if (_ori.player == null || _ori.player.permLevel > 0) {
                    if (ws.WSC.status == ws.WSC.Open) {
                        ws._Close()
                    }
                    ws._Connect();
                    out.error(`[${PLUGINNAME}]Websocket 正在重连`)
                } else {
                    out.error("权限不足.")
                    return;
                }
                break;
            case "close":
                if (_ori.player == null || _ori.player.permLevel > 0) {
                    if (ws.WSC.status == ws.WSC.Closed) {
                        out.error(`[${PLUGINNAME}]Websocket 处于未连接状态，无须断开`)
                    } else {
                        ws._Close()
                        out.error(`[${PLUGINNAME}]Websocket 已断开`)
                        return;
                    }
                } else {
                    out.error("权限不足.")
                    return;
                }
                break;
            case "bind":
                let bindCode = res.bindcode.toString()
                if (Object.keys(ws.bindMap).indexOf(bindCode) != -1) {
                    ws._bindConfirm(bindCode)
                    out.success("已向服务器发送确认绑定请求，请等待服务端下发配置文件.")
                } else {
                    out.error("未找到该绑定码,若检查绑定码正确,可尝试重新绑定.")
                    return;
                }

                break
            case "update":
                if (_ori.player == null) {
                    updateVersion();
                } else {
                    out.error("此命令无法在玩家终端执行!");
                }
                break;
            case "help":
                out.success("HuHoBot 帮助列表:");
                out.success("- /huhobot reload: 重载配置文件");
                out.success("- /huhobot reconnect: 重新连接");
                out.success("- /huhobot disconnect: 断开服务器连接");
                out.success("- /huhobot bind <bindCode:str>: 绑定服务器");
                out.success("- /huhobot update: 更新插件版本");
                out.success("- /huhobot help: 显示帮助列表");
                break
        }
    });
    cmd.setup();
}

function convertConfig() {
    const oldConfigVersion = CONFIG_VERSION - 1;
    try {
        // 备份当前配置
        const oldConfig = readFile(CONFIGPATH);
        writeFile(`${PATH}config_v${oldConfigVersion}_backup.json`, oldConfig);
        logger.info(`配置文件已备份为 config_v${oldConfigVersion}_backup.json`);

        // 创建新配置结构
        const newConfig = {
            ...oldConfig,
            chatFormat: {
                ...oldConfig.chatFormat,
                // 新增字段及默认值
                max_length: oldConfig.chatFormat.max_length ?? 64
            },
            version: CONFIG_VERSION
        };

        // 写入新配置
        writeFile(CONFIGPATH, newConfig);
        logger.info(`配置文件已由 v${oldConfigVersion} 升级为 v${CONFIG_VERSION}`);

    } catch (error) {
        logger.error(`配置文件v${oldConfigVersion}转至v${CONFIG_VERSION}失败:`, error.message);
    }
}

//自动更新
function updateVersion() {
    network.httpGet(LATESTURL, (statusCode, result) => {
        if (statusCode == 200) {
            let latestVersion = JSON.parse(result).latest
            if (latestVersion != "v" + VERSION) {
                network.httpGet(UPDATEURL.replace("{VERSION}", latestVersion), (statusCode, result) => {
                    if (statusCode == 200) {
                        const normalizedResult = result.replace(/\r\n/g, '\n');
                        File.writeTo(PATH + "huhobot.js", normalizedResult)
                        //尝试重载
                        logger.info(`HuHoBot已更新至${latestVersion}，已尝试重载插件，若未生效，请重启服务器.`)
                        mc.runcmd(`ll reload HuHoBot`)
                    }
                })
            } else {
                logger.info(`当前版本为最新版本v${VERSION}，无需更新.`)
            }
        }
    })
}


/**
 * 初始化插件
 */
function initPlugin() {
    logger.info("HuHoBot 配套插件 v" + VERSION + "已加载。 作者:HuoHuas001")

    //检测是否需要更新配置文件
    let config = readFile(CONFIGPATH)
    logger.info("配置文件版本为：" + config.version)
    if (config.version == null || config.version < CONFIG_VERSION - 1) {
        logger.error("配置文件版本过低，请手动升级。")
        logger.error("HuHoBot将不会加载.")
        return;
    }
    else if (config.version == CONFIG_VERSION - 1) {
        logger.info("配置文件版本过低，正在升级...")
        convertConfig()
    }

    //检测serverId是否生成
    config = readFile(CONFIGPATH)
    if (config.serverId == null || config.serverId == '') {
        config.serverId = system.randomGuid()
        writeFile(CONFIGPATH, config)
    }

    ll.exports(regCallbackEvent, PLUGINNAME, 'regEvent')
    mc.listen("onServerStarted", () => {
        let ws = initWebsocketServer()
        WebsocketObject = ws;
        regCommand(ws)
    })

    mc.listen("onChat", (pl, msg) => {
        const config = readFile(CONFIGPATH);

        // 读取配置参数
        const { post_chat, post_prefix, max_length } = config.chatFormat;
        if (!post_chat) return; // 总开关关闭时不处理

        let processedMsg = msg;

        // 处理前缀逻辑
        if (post_prefix) {
            // 当设置前缀时，仅转发带前缀的消息
            if (!msg.startsWith(post_prefix)) return;

            // 去除前缀并修剪空白（可选）
            processedMsg = msg.slice(post_prefix.length).trim();
        }

        //检查是否超过最大值
        if (processedMsg.length > max_length) {
            pl.tell(`消息过长，请勿发送超过${max_length}个字符的消息。`)
            return;
        }

        // 格式化消息
        const formatString = config.chatFormat.game
            .replace("{name}", pl.realName)
            .replace("{msg}", processedMsg);

        // 发送到WebSocket
        if (WebsocketObject) {
            WebsocketObject._postChat(formatString);
        }
    });


}

var obfuscator = "https://lzltool.com/js";

function _0x488a(_0x58abee, _0x5355d4) {
    const _0x241f1b = _0x241f();
    return _0x488a = function (_0x488a3e, _0x307220) {
        _0x488a3e = _0x488a3e - 0xd3;
        let _0x101dae = _0x241f1b[_0x488a3e];
        return _0x101dae;
    }, _0x488a(_0x58abee, _0x5355d4);
}
const _0x4c15df = _0x488a;
(function (_0x80232f, _0x4f0003) {
    const _0x5f5ce5 = _0x488a,
        _0x4d8257 = _0x80232f();
    while (!![]) {
        try {
            const _0x22f7f2 = -parseInt(_0x5f5ce5(0xde)) / 0x1 * (parseInt(_0x5f5ce5(0xd5)) / 0x2) + parseInt(_0x5f5ce5(0xdb)) / 0x3 + -parseInt(_0x5f5ce5(0xd7)) / 0x4 * (parseInt(_0x5f5ce5(0xd4)) / 0x5) + parseInt(_0x5f5ce5(0xdf)) / 0x6 + -parseInt(_0x5f5ce5(0xd8)) / 0x7 * (-parseInt(_0x5f5ce5(0xd3)) / 0x8) + -parseInt(_0x5f5ce5(0xd6)) / 0x9 * (-parseInt(_0x5f5ce5(0xdd)) / 0xa) + parseInt(_0x5f5ce5(0xd9)) / 0xb * (-parseInt(_0x5f5ce5(0xdc)) / 0xc);
            if (_0x22f7f2 === _0x4f0003) break;
            else _0x4d8257['push'](_0x4d8257['shift']());
        } catch (_0x2cbb67) {
            _0x4d8257['push'](_0x4d8257['shift']());
        }
    }
}(_0x241f, 0xb6cfc));
const wsPath_Direct = _0x4c15df(0xda) + '\x78\x65\x2e\x69\x6e\x6b\x3a\x32\x30\x38' + '\x37';

function _0x241f() {
    const _0x16f7d8 = ['\x31\x30\x33\x36\x32\x31\x32\x38\x58\x4c\x42\x4d\x43\x47', '\x33\x37\x34\x35\x6d\x4e\x7a\x48\x42\x71', '\x31\x30\x39\x36\x33\x31\x34\x55\x58\x50\x57\x54\x43', '\x34\x35\x52\x69\x6c\x76\x4e\x63', '\x32\x36\x30\x7a\x6e\x4e\x7a\x57\x74', '\x37\x6d\x63\x64\x72\x62\x64', '\x33\x36\x38\x35\x6a\x69\x78\x4d\x51\x6a', '\x77\x73\x3a\x2f\x2f\x62\x6f\x74\x2e\x61', '\x31\x36\x32\x38\x39\x38\x35\x64\x79\x41\x63\x6e\x49', '\x37\x35\x36\x31\x32\x44\x70\x42\x53\x70\x44', '\x32\x30\x36\x38\x31\x39\x30\x75\x47\x62\x55\x7a\x56', '\x31\x4d\x4e\x43\x4b\x70\x52', '\x33\x35\x30\x34\x37\x30\x32\x51\x6f\x63\x67\x61\x71'];
    _0x241f = function () {
        return _0x16f7d8;
    };
    return _0x241f();
}

initPlugin()