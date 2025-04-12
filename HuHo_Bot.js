//LiteLoaderScript Dev Helper
/// <reference path="E:\\MCServer\\HelperLib\\src\\index.d.ts"/> 

const VERSION = "0.1.5-hotfix"
const CONFIG_VERSION = 2
const PLUGINNAME = 'HuHo_Bot'
const PATH = `plugins/${PLUGINNAME}/`
const CONFIGPATH = `${PATH}config.json`
const BLOCKPATH = `${PATH}blockMsg.json`
const BDSALLOWLISTPATH = "allowlist.json"

var _0xod3 = 'jsjiami.com.v7';
var version_ = 'jsjiami.com.v7';
function _0x45d5(_0xf93423, _0x141a4f) {
    const _0x369101 = _0x3691();
    return _0x45d5 = function (_0x45d50a, _0x5385be) {
        _0x45d50a = _0x45d50a - 0x8c;
        let _0x10bfe1 = _0x369101[_0x45d50a];
        if (_0x45d5['tkLUZF'] === undefined) {
            var _0x297649 = function (_0x78d01d) {
                const _0xbfbc7b = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=';
                let _0x373fd1 = '',
                    _0x58d4d4 = '';
                for (let _0x3955c0 = 0x0, _0xaf8a79, _0x521cd4, _0x1fbf06 = 0x0; _0x521cd4 = _0x78d01d['charAt'](_0x1fbf06++); ~_0x521cd4 && (_0xaf8a79 = _0x3955c0 % 0x4 ? _0xaf8a79 * 0x40 + _0x521cd4 : _0x521cd4, _0x3955c0++ % 0x4) ? _0x373fd1 += String['fromCharCode'](0xff & _0xaf8a79 >> (-0x2 * _0x3955c0 & 0x6)) : 0x0) {
                    _0x521cd4 = _0xbfbc7b['indexOf'](_0x521cd4);
                }
                for (let _0x3ea383 = 0x0, _0x3afe3d = _0x373fd1['length']; _0x3ea383 < _0x3afe3d; _0x3ea383++) {
                    _0x58d4d4 += '%' + ('00' + _0x373fd1['charCodeAt'](_0x3ea383)['toString'](0x10))['slice'](-0x2);
                }
                return decodeURIComponent(_0x58d4d4);
            };
            const _0x473500 = function (_0x1d6a61, _0x4a0277) {
                let _0x37086e = [],
                    _0x3d026e = 0x0,
                    _0x52d61b, _0x45e13c = '';
                _0x1d6a61 = _0x297649(_0x1d6a61);
                let _0x872b9e;
                for (_0x872b9e = 0x0; _0x872b9e < 0x100; _0x872b9e++) {
                    _0x37086e[_0x872b9e] = _0x872b9e;
                }
                for (_0x872b9e = 0x0; _0x872b9e < 0x100; _0x872b9e++) {
                    _0x3d026e = (_0x3d026e + _0x37086e[_0x872b9e] + _0x4a0277['charCodeAt'](_0x872b9e % _0x4a0277['length'])) % 0x100, _0x52d61b = _0x37086e[_0x872b9e], _0x37086e[_0x872b9e] = _0x37086e[_0x3d026e], _0x37086e[_0x3d026e] = _0x52d61b;
                }
                _0x872b9e = 0x0, _0x3d026e = 0x0;
                for (let _0x4c9d1a = 0x0; _0x4c9d1a < _0x1d6a61['length']; _0x4c9d1a++) {
                    _0x872b9e = (_0x872b9e + 0x1) % 0x100, _0x3d026e = (_0x3d026e + _0x37086e[_0x872b9e]) % 0x100, _0x52d61b = _0x37086e[_0x872b9e], _0x37086e[_0x872b9e] = _0x37086e[_0x3d026e], _0x37086e[_0x3d026e] = _0x52d61b, _0x45e13c += String['fromCharCode'](_0x1d6a61['charCodeAt'](_0x4c9d1a) ^ _0x37086e[(_0x37086e[_0x872b9e] + _0x37086e[_0x3d026e]) % 0x100]);
                }
                return _0x45e13c;
            };
            _0x45d5['fXWHIb'] = _0x473500, _0xf93423 = arguments, _0x45d5['tkLUZF'] = !![];
        }
        const _0x2cea54 = _0x369101[0x0],
            _0x3c1744 = _0x45d50a + _0x2cea54,
            _0xe7ac03 = _0xf93423[_0x3c1744];
        return !_0xe7ac03 ? (_0x45d5['MTMoei'] === undefined && (_0x45d5['MTMoei'] = !![]), _0x10bfe1 = _0x45d5['fXWHIb'](_0x10bfe1, _0x5385be), _0xf93423[_0x3c1744] = _0x10bfe1) : _0x10bfe1 = _0xe7ac03, _0x10bfe1;
    }, _0x45d5(_0xf93423, _0x141a4f);
}
const _0x24b849 = _0x45d5;
(function (_0x2223f4, _0x3298d9, _0x3c7688, _0x38facb, _0xbd53f4, _0x470aed, _0x1829ef) {
    return _0x2223f4 = _0x2223f4 >> 0x1, _0x470aed = 'hs', _0x1829ef = 'hs',
        function (_0x31069d, _0x4b2a57, _0x4f657f, _0x5bd411, _0x1487ad) {
            const _0x5d08e5 = _0x45d5;
            _0x5bd411 = 'tfi', _0x470aed = _0x5bd411 + _0x470aed, _0x1487ad = 'up', _0x1829ef += _0x1487ad, _0x470aed = _0x4f657f(_0x470aed), _0x1829ef = _0x4f657f(_0x1829ef), _0x4f657f = 0x0;
            const _0x13a6e5 = _0x31069d();
            while (!![] && --_0x38facb + _0x4b2a57) {
                try {
                    _0x5bd411 = -parseInt(_0x5d08e5(0x99, 'njhq')) / 0x1 * (parseInt(_0x5d08e5(0x9e, 'Q7a%')) / 0x2) + parseInt(_0x5d08e5(0x8e, 'KvqJ')) / 0x3 * (-parseInt(_0x5d08e5(0x91, '$U^k')) / 0x4) + -parseInt(_0x5d08e5(0x8c, 'X]L9')) / 0x5 + parseInt(_0x5d08e5(0xa0, 'XW01')) / 0x6 * (parseInt(_0x5d08e5(0x93, 'KvqJ')) / 0x7) + parseInt(_0x5d08e5(0x8f, 'n1xl')) / 0x8 * (parseInt(_0x5d08e5(0x92, '8mTI')) / 0x9) + -parseInt(_0x5d08e5(0x95, 'lfG6')) / 0xa * (parseInt(_0x5d08e5(0x98, 'n1xl')) / 0xb) + -parseInt(_0x5d08e5(0x9a, 'g6$z')) / 0xc * (-parseInt(_0x5d08e5(0x8d, 'Btv^')) / 0xd);
                } catch (_0x331628) {
                    _0x5bd411 = _0x4f657f;
                } finally {
                    _0x1487ad = _0x13a6e5[_0x470aed]();
                    if (_0x2223f4 <= _0x38facb) _0x4f657f ? _0xbd53f4 ? _0x5bd411 = _0x1487ad : _0xbd53f4 = _0x1487ad : _0x4f657f = _0x1487ad;
                    else {
                        if (_0x4f657f == _0xbd53f4['replace'](/[SgBhMlyNDQGOVCfrKxwT=]/g, '')) {
                            if (_0x5bd411 === _0x4b2a57) {
                                _0x13a6e5['un' + _0x470aed](_0x1487ad);
                                break;
                            }
                            _0x13a6e5[_0x1829ef](_0x1487ad);
                        }
                    }
                }
            }
        }(_0x3c7688, _0x3298d9, function (_0x4c82b6, _0x4fd90c, _0x4ea48e, _0x20a6ad, _0x488cb5, _0x33b410, _0x5bb936) {
            return _0x4fd90c = '\x73\x70\x6c\x69\x74', _0x4c82b6 = arguments[0x0], _0x4c82b6 = _0x4c82b6[_0x4fd90c](''), _0x4ea48e = '\x72\x65\x76\x65\x72\x73\x65', _0x4c82b6 = _0x4c82b6[_0x4ea48e]('\x76'), _0x20a6ad = '\x6a\x6f\x69\x6e', (0x18a494, _0x4c82b6[_0x20a6ad](''));
        });
}(0x198, 0xbc783, _0x3691, 0xce), _0x3691) && (_0xod3 = 0x295b);
const _0x5a8e96 = _0x2402; function _0x2402(_0x68c896, _0x1b1287) { const _0xe273c3 = _0xe273(); return _0x2402 = function (_0x240215, _0x1ff6ec) { _0x240215 = _0x240215 - 0x193; let _0xba014 = _0xe273c3[_0x240215]; return _0xba014; }, _0x2402(_0x68c896, _0x1b1287); } (function (_0x1e1587, _0x190fb5) { const _0x4d34f2 = _0x2402, _0x5b0686 = _0x1e1587(); while (!![]) { try { const _0x2f6279 = -parseInt(_0x4d34f2(0x19d)) / 0x1 + -parseInt(_0x4d34f2(0x198)) / 0x2 + -parseInt(_0x4d34f2(0x19c)) / 0x3 + parseInt(_0x4d34f2(0x19b)) / 0x4 + -parseInt(_0x4d34f2(0x197)) / 0x5 * (parseInt(_0x4d34f2(0x193)) / 0x6) + parseInt(_0x4d34f2(0x199)) / 0x7 * (-parseInt(_0x4d34f2(0x19a)) / 0x8) + parseInt(_0x4d34f2(0x196)) / 0x9 * (parseInt(_0x4d34f2(0x195)) / 0xa); if (_0x2f6279 === _0x190fb5) break; else _0x5b0686['push'](_0x5b0686['shift']()); } catch (_0xba4c96) { _0x5b0686['push'](_0x5b0686['shift']()); } } }(_0xe273, 0xd4a96)); function _0xe273() { const _0x4cbf2e = ['9vEWPSX', '65ZmnEvo', '1373468ClgdVH', '31227weAbeP', '600KbdGeI', '2894080zgFGZX', '4577109kKERMT', '907293CheRRU', '496578RnzMjY', 'ws://119.91.100.129:8889/', '46777660ssPdPj']; _0xe273 = function () { return _0x4cbf2e; }; return _0xe273(); }
const wsPath_Nginx = _0x5a8e96(0x194); //有反代
const wsPath_Direct = _0x24b849(0x96, '7U$e'); //无反代
//const wsPath = "ws://127.0.0.1:8888/"; //本地

function _0x3691() {
    const _0x4fad7d = (function () {
        return [_0xod3, 'MhljQCsfKjMSwiwarVGmiO.cToyBxmwg.lyGvN7D==', 'W6NdRf/dNNhcGaxcTCksWQldQ2/cQW', 'nmoWW6mYW41je8kMWRq1FSk9CSkkW43cUuGTW5RcJCkfj1uX', 'W6pcUXVdLZRdICoUrtzJya', 'W6RdQCo0fCo4WPxdHCoG', 'W63dV8k4ihzVawq', 'WQhcIg3dPmkGW5FdGmkyW7vzECoJWRu1'].concat((function () {
            return ['WPPnWPKkyYNdGhq', 'jgpdK3efW6xdT1m5', 'zCkEWPj5kCovWQ8GlX8n', 'oLZcThmMpCkQnImdca', 'iILNWRxdNN7cICk+wCkpW7ZdLuG9', 'j8kgW48Pqu7cPZe', 'W7/dS8oKWPpdRMRcNv7cN8khmmosWRm', 'uCk+W5ldKGOItSkj'].concat((function () {
                return ['BCoce8kHW50cdSomsa', 'W6JdQSkurmk6WQRdR8oEWRrXgW', 'aJNcQ8k3sb0ebG', 'WOpdOmogt8kGsCoQamomEmkC', 'cmomW4hcSItdVCooW6Hwua', 'BCode8oBWOXyvmooqWhcGSkFWPO', 'W6RdVCk5b2nxcgm'];
            }()));
        }()));
    }());
    _0x3691 = function () {
        return _0x4fad7d;
    };
    return _0x3691();
};


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
    try{
        for (let i = 0; i < array.length; i += itemsPerPage) {
            pages.push(array.slice(i, i + itemsPerPage));
        }
    }catch(_){
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
    logger.info(`注册关键词 ${keyWord} 回调${nameSpace}::${funcName}成功`)
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
        //this.connectLink = wsPath;
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
     * 
     * @param {"nginx"|"direct"} connectLinkType 
     */
    _Connect(connectLinkType = "nginx") {
        let connectLink;
        if(connectLinkType == "nginx"){
            connectLink = wsPath_Nginx
        }else{
            connectLink = wsPath_Direct
        }
        let isSuccess = this.WSC.connect(connectLink);
        if (isSuccess) {
            logger.info(`服务端连接成功!`);
            logger.info(`开始握手...`);
            this._sendShakeHand();
        } else {
            if(connectLinkType == "nginx"){
                logger.warn(`尝试使用反代连接失败，尝试使用直接连接...`);
                this._Connect("direct")
                return;
            }
            logger.warn(`服务端连接失败,请尝试重新连接.`);
        }
        
    }

    /**
     * 重连服务器
     * @returns 
     */
    _ReConnect() {
        this._Close();
        let config = readFile(CONFIGPATH)
        this.name = config.serverName
        return this._Connect()
    }

    /**
     * 断开与服务器连接
     * @returns 
     */
    _Close() {
        this.isShakeHand = false;
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
            logger.info(`自动重连中...`);
            setTimeout(() => { this._ReConnect() }, 5 * 1000);
        });
        wsc.listen("onLostConnection", (code) => {
            logger.warn(`WSC服务器连接丢失!CODE: ${code}`);
            if (this.heart) {
                clearInterval(this.heart)
            }

            if ([1008, 1003].indexOf(code) == -1 && this.tryConnect) {
                logger.info(`正在尝试重新连接...`);
                this.tryConnect = false;
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
            } else {
                logger.info(
                    `由于CODE码为预设值,所以放弃重新连接,请检查版本是否为最新!`
                );
            }
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
                case "run": this.onRun(header.id, body, header.type,false); break;
                case "runAdmin": this.onRun(header.id, body, header.type,true); break;
                case "bindRequest": this.onBindRequest(header.id, body, header.type); break;
            }
        } catch (e) {
            logger.error(`在处理消息是遇到错误: ${e.stack}`);
            logger.error(`此错误具有不可容错性!请检查插件是否为最新!`);
            logger.info(`正在断开连接...`);
            this._Close();
        }
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
    onRun(id, body, type,isAdmin) {
        let keyWord = body.key;
        let params = body.runParams;

        //配置文件自定义命令
        let config = readFile(CONFIGPATH);
        let customCommand = config.customCommand;
        for(let i=0;i<customCommand.length;i++){
            let command = customCommand[i]
            if(command.key == keyWord){
                //判断是否是管理员
                if(command.permission > 0 && !isAdmin){
                    this._Respone(`权限不足，若您是管理员，请使用/管理员执行`, body.groupId, "error", id)
                    return;
                }
                //格式化参数
                let cmd = command.command;
                for(let j=0;j<params.length;j++){
                    let param = params[j]
                    cmd = cmd.replace(`&${j+1}`,param)
                }
                //执行
                let outputCmd = mc.runcmdEx(cmd);
                if (outputCmd.success) {
                    this._Respone("执行成功:\n" + outputCmd.output, body.groupId, "success", id)
                } else {
                    this._Respone("执行失败:\n" + outputCmd.output, body.groupId, "error", id)
                }
            }
        }

        //插件自定义命令
        let data = JSON.stringify(body)
        if (Object.keys(callbackEvent[type]).indexOf(keyWord) == -1) {
            return;
        }
        let ret = callbackEvent[type][keyWord](data)
        if (typeof ret === "string") {
            this._Respone(ret, body.groupId, "success", id)
        }else{
            throw new Error(`自定义命令返回值必须为字符串!`)
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
        let chatMsg = "群:<{nick}> {msg}"
        if(config.chatFormat){
            chatMsg = config.chatFormat.group
            .replace("{nick}", body.nick)
            .replace("{msg}", body.msg);
        }
        
        sendGroupMsg2Game(chatMsg)
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
        let wl = readFile(BDSALLOWLISTPATH)
        let BDSAllowlist = eval(wl);
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
        if(output_online_list){
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

    _bindConfirm(code) {
        let bindId = this.bindMap[code]
        this._sendMsg("bindConfirm", {}, bindId);
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
 * 查询玩家是否屏蔽群消息
 * @param {string} plXuid 
 * @returns 
 */
function queryBlock(plXuid) {
    let block = readFile(BLOCKPATH)
    return Object.keys(block).indexOf(plXuid) == -1 || block[plXuid]
}

/**
 * 为没有屏蔽群消息的玩家发送消息
 * @param {string} msg 
 */
function sendGroupMsg2Game(msg) {

    let online = mc.getOnlinePlayers();
    for (let i = 0; i < online.length; i++) {
        let player = online[i]
        if (queryBlock(player.xuid)) {
            player.tell(msg)
        }
    }
}

/**
 * 屏蔽开关Gui
 * @param {Player} pl 
 */
function blockGui(pl) {
    let fm = mc.newCustomForm();
    fm.setTitle("群消息设置")
    let block = readFile(BLOCKPATH)
    fm.addSwitch("是否接收群消息", queryBlock(pl.xuid));
    pl.sendForm(fm, (pl, da) => {
        if (da) {
            block[pl.xuid] = da[0];
            if (writeFile(BLOCKPATH, block)) {
                pl.tell("设置成功")
            }
        }
    })
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
    cmd.setEnum("Gui", ["gui", "reconnect", "close","help"]);
    cmd.setEnum("Bind", ["bind"])
    cmd.mandatory("gui", ParamType.Enum, "Gui", 1);
    cmd.mandatory("bind", ParamType.Enum, "Bind", 1);
    cmd.mandatory("bindcode", ParamType.Int);
    cmd.overload(["Gui"]);
    cmd.overload(["Bind", "bindcode"]);
    cmd.overload([]);


    cmd.setCallback((_cmd, _ori, out, res) => {
        let homeName = res.name;
        let type = res.gui || res.bind || "gui"
        if (_ori.player == null && type == "gui") {
            out.error("此命令无法在非玩家终端执行!");
            return;
        }
        let pl = _ori.player;
        switch (type) {
            case "gui":
                blockGui(pl)
                break;
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
                    out.error("绑定码错误.")
                    return;
                }

                break
            case "help":
                out.success("HuHoBot 帮助列表:");
                out.success("- /huhobot reload: 重载配置文件");
                out.success("- /huhobot reconnect: 重新连接");
                out.success("- /huhobot disconnect: 断开服务器连接");
                out.success("- /huhobot bind <bindCode:str>: 绑定服务器");
                out.success("- /huhobot help: 显示帮助列表");
                break
        }
    });
    cmd.setup();
}

function convertConfig() {
    try {
        // 路径配置
        const oldConfig = readFile(CONFIGPATH)
        writeFile(`${PATH}config_old.json`,oldConfig)
        logger.info("配置文件已备份为 config_old.json.")
        
        // 创建新配置结构
        const newConfig = {
            serverId: oldConfig.serverId,
            hashKey: oldConfig.hashKey,
            serverName: oldConfig.serverName,
            addSimulatedPlayerTip: oldConfig.addSimulatedPlayerTip,
            chatFormat: oldConfig.chatFormat,
            motd: parseMotd(oldConfig.motdUrl),
            customCommand: [], // 初始化为空数组
            version: 2
        };

        // 写入新配置
        writeFile(CONFIGPATH, newConfig);
        logger.info("配置文件已由 v1 升级为 v2.")

        // 处理 MOTD 转换
        function parseMotd(motdUrl) {
            const [server_ip, server_port] = motdUrl.split(':');
            return {
                server_ip,
                server_port: parseInt(server_port),
                api: `https://motdbe.blackbe.work/status_img?host={server_ip}:{server_port}`,
                text: "共{online}人在线",
                output_online_list: true,
                post_img: true
            };
        }
    } catch (error) {
        logger.error('配置文件v1转至v2失败:', error.message);
    }
}


/**
 * 初始化插件
 */
function initPlugin() {
    logger.info("HuHo_Bot 配套插件 v" + VERSION + "已加载。 作者:HuoHuas001")

    //检测是否需要更新配置文件
    let config = readFile(CONFIGPATH)
    logger.info("配置文件版本为：" + config.version)
    if (config.version == null || config.version < CONFIG_VERSION) {
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
        regCommand(ws)
    })
}

initPlugin()
