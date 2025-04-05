# HuHoBot BDSAdapter Adapter

[![GitHub Release](https://img.shields.io/github/v/release/HuHoBot/BDSAdapter?style=for-the-badge)](https://github.com/HuHoBot/BDSAdapter/releases)
[![License](https://img.shields.io/github/license/HuHoBot/BDSAdapter?style=for-the-badge)](https://github.com/HuHoBot/BDSAdapter/blob/main/LICENSE)

专为BDS设计的下一代基岩版服务器管理解决方案，提供安全的无第三方QQ机器人依赖管理体验。

## 🌟 核心优势

| 特性     | 传统方案             | HuHoBot           |
|--------|------------------|-------------------|
| 账号安全   | ❌ 需要实体QQ号，存在封号风险 | ✅ 无QQ第三方客户端依赖，零风控 |
| 部署复杂度  | ❌ 需搭建完整机器人框架     | ✅ 即装即用，一键绑定       |
| 服务器兼容性 | ❌ 部分面板服不支持       | ✅ 全平台兼容，有网即用      |
| 协议更新影响 | ❌ 需要频繁适配新协议      | ✅ 协议无关设计，相对稳定     |
****
## 🚀 功能特性

### 核心功能

- **无缝绑定**：通过WebSocket实现服务器与控制端即时绑定
- **智能风控规避**：基于事件驱动的非侵入式通信协议

### 功能列表

<details>
<summary>📜 点我查看</summary>

| 命令     | 描述             |
|--------|----------------|
| /添加白名单 | 向服务器内添加一个白名单   |
| /删除白名单 | 向服务器内删除一个白名单   |
| /绑定    | 绑定服务器          |
| /设置名称  | 设置自己在本群群服互通的名称 |
| /发信息   | 群服互通向服务器内发送消息  |
| /执行命令  | 向服务器发送执行命令的请求  |
| /查白名单  | 查询服务器内置白名单     |
| /查在线   | 查询服务器在线名单      |
| /在线服务器 | 查询在线服务器        |
| /执行    | 执行自定义指令        |
| /管理员执行 | 以管理员身份运行自定义内容  |

</details>

### 进阶功能

- **扩展API**
    - 自定义命令系统(详见下文)

## 📥 安装指南

### 环境要求

- LegacyScriptEngine 0.9.4+

### 快速开始

1. **访问 GitHub Releases 页面**：
- 打开浏览器，访问 [HuHoBot-BDSAdapter Releases](https://github.com/HuHoBot/EndStoneAdapter/releases)
- 下载最新版本的 `HuHoBot-BDS-vx.x.x.zip` 文件

2. **放置插件文件**：
- 将下载的 `HuHoBot-BDS-vx.x.x.zip` 文件`解压后`放入服务器的 `plugins` 目录中

3. **重启服务器**：
- 重启你的 Minecraft 服务器以加载新插件

4. **添加机器人**
- [加入交流群](http://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=N6tVRxGR8sDwYHBx9YgAhkqRTp1gseyk&authKey=M7Fd3Op6nHjXjSXefBtHBPqIq2wtX8AfufZor9DrfRrJkhyS2rohkt7iuOSwbtn8&noverify=0&group_code=1005746321) 点击HuHo_Bot头像并添加到群聊

5. **完成绑定**：
- 按照控制台提示完成服务器与机器人的绑定操作

### 高级配置（可选）

- 如果需要自定义功能，请参考`⚙️ 配置示例`进行详细设置

---

## ⚙️ 配置示例

```json5
{
	"serverId": "", //不用管
	"hashKey": "", //不用管
	"serverName": "server", // 服务器名称
	"addSimulatedPlayerTip": true, //是否添加模拟玩家提示
	"chatFormat": {
		"game": "<{name}> {msg}", // 群聊格式
		"group": "群:<{nick}> {msg}"
	},
	"motdUrl": "play.easecation.net:19132" //使用/查在线的时候显示的图片地址（改成你自己的进服地址）
}

```

## ❓ 常见问题

<details>
<summary>🤔 怎么绑定不上？</summary>
检查控制台是否输出"握手成功"的字段
如果未出现，请使用/huhobot reconnect手动重新建立连接
</details>

<details>
<summary>🤔 需要准备QQ号吗？</summary>
完全不需要！本方案采用全新的通信协议，彻底摆脱对第三方聊天平台的依赖。
</details>

<details>
<summary>🛡️ 支持哪些服务器版本？</summary>
✅ 已测试版本：1.21.50+
</details>

<details>
<summary>🔧 如何更新配置？</summary>
支持热重载配置：<code>/huhobot reload</code>
</details>

<details>
<summary>🤖 怎么开启消息互通？</summary>
本机器人不支持群服消息互通，因官方机器人API限制每个群每月仅能发送三条主动消息
</details>

<details>
<summary>🌐 查在线显示其他服务器信息？</summary>
请修改配置文件中的 <code>motdUrl</code> 字段为你的服务器地址  
示例：<code>motdUrl: "play.yourserver.com:25565"</code>
</details>

<details>
<summary>🔍 查在线无反应怎么办？</summary>
排查步骤：  

1. 检查连接状态，使用 <code>/huhobot reconnect</code> 重连

2. 尝试清空 motdUrl 字段：<code>"motdUrl": ""</code>

</details>

<details>
<summary>⌨️ 执行命令无响应？</summary>
注意命令格式区别：  

- <code>/执行 加白</code> → 用于自定义指令回调

- <code>/执行命令 list</code> → 向控制台发送命令

</details>

<details>
<summary>👥 允许玩家自助加白名单？</summary>
请按上文配置文件示例配置customCommand字段

使用方式：<code>/执行 加白 "玩家ID"</code>（带空格参数需加引号）

</details>

<details>
<summary>👮 如何设置管理员？</summary>
在群内使用指令：  
<code>/管理帮助</code> → 查看管理指令列表
</details>

<details>
<summary>🏰 是否支持多个服务器？</summary>
当前版本每个群仅支持绑定一个服务器，多服务器绑定功能正在开发中  
如需管理多服务器，建议为每个服务器创建独立群组
</details>

### 配置自定义命令

#### 通过插件设置

您可以按如下代码创建一个插件，编写一个HuHoBot拓展模块，并使用HuHoBot的API注册回调函数

```javascript
const HUHONAMESPACE = 'HuHo_Bot' //勿动
const NAMESPACE = 'Test' //修改成你自己想要的Namespace

/**
 * 回调函数
 * @param {array} keyWord
 */

function Callback(params){ 
    return "测试成功" //可以返回一个文本消息到群内
}

/**
 * 注册回调函数
 * @param {string} keyWord
 * @param {function} func
 */

function regCallbackEvent(type,keyWord,func){
    if(!ll.hasExported(HUHONAMESPACE,'regEvent')){
        return;
    }
    let regEvent = ll.imports(HUHONAMESPACE,'regEvent')
    ll.exports(func,NAMESPACE,func.name)
    regEvent(type,keyWord,NAMESPACE,func.name)
}

mc.listen("onServerStarted",()=>{
    let keyWord = "测试" //触发关键词
    regCallbackEvent("run",keyWord,Callback)
})
```

## 📄 开源协议

[GNU General Public License v3.0](LICENSE) - 自由使用、修改和分发，但需遵守以下条款：

- **开源义务**：任何衍生作品必须保持开源
- **相同许可**：修改后的版本必须使用相同许可证
- **版权声明**：必须保留原始版权声明

完整协议文本请查看 [LICENSE](LICENSE) 文件

## 🤝 参与贡献

欢迎提交PR或通过[Discussions](https://github.com/HuHoBot/BDSAdapter/discussions)提出建议

