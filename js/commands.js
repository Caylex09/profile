// 定义终端可以响应的所有命令内容

const ABOUT_ME = `
Hello! 我是 Caylex。
一名前端/全栈开发者，喜欢探索和折腾各种有趣的技术。
平时喜欢写代码、做些有意思的小工具。
欢迎来到我的终端极客世界！
`;

const SKILLS = `
===================
[ 语言 ]
- Python          [████████--] 80%
- JS/TypeScript   [█████████-] 90%
- C++ / C         [██████----] 60%

[ 常用技术栈 / 工具 ]
- Vue / React / Node.js
- Flask / Django / FastAPI
- Docker / Git / Linux
===================
`;

const CONTACT = `
您可以通过以下方式联系或关注我:

- GitHub: https://github.com/Caylex09
- Email:  your_email@example.com
- Blog:   https://yourblog.domain
`;

const PROJECTS = `
[01] Duelbot    - 一个基于 Python 的 Discord 机器人。
[02] Poem Snake - 基于 Web 的诗词接龙趣味游戏。
[03] Flask App  - 基于局域网蓝牙客户端/服务端的聊天室。

(注: 可以输入对应项目的全称或者直接在真实环境中绑定外部跳转)
`;

const HELP = `
可用命令列表:
  about      - 显示关于我的介绍
  skills     - 查看我的技能条
  projects   - 列出我的项目档案
  contact    - 各种联系方式
  date       - 查看服务器当前日期时间
  whoami     - 查看你的身份
  clear      - 清屏
`;

// 导出作为一个全局字典供 main.js 使用
window.C_COMMANDS = {
    'help': HELP.trim(),
    'about': ABOUT_ME.trim(),
    'skills': SKILLS.trim(),
    'projects': PROJECTS.trim(),
    'contact': CONTACT.trim(),
    'whoami': 'user@guest (访客模式)',
    'sudo': 'Access denied. This incident will be reported to Caylex.',
    'ls': 'index.html  css/  js/  README.md  profile.txt'
};