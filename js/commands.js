// 定义终端可以响应的所有命令内容

const ABOUT_ME = `
Hello! 我是 Caylex。
`;

const CONTACT = `
您可以通过以下方式联系或关注我:
- GitHub: https://github.com/Caylex09
- Luogu: https://www.luogu.com.cn/user/516346
- Zhihu: https://www.zhihu.com/people/cyx09

`;

const PROJECTS = `
[01] 博客: https://blog.cyx2009.top
[02] Buy Me a Coffee / V 我 50: https://album.cyx2009.top
[03] 实验室: https://lab.cyx2009.top
`;

const HELP = `
可用命令列表:
  about      - 显示关于我的介绍
  projects   - 我的项目列表
  contact    - 各种联系方式
  date       - 查看服务器当前日期时间
  whoami     - 查看你的身份
  clear      - 清屏
  sudo       - 尝试使用管理员权限
  ls         - 列出当前目录下的文件
  ping       - pong
  poem       - 一句诗
`;

// 导出作为一个全局字典供 main.js 使用
window.C_COMMANDS = {
  'help': HELP.trim(),
  'about': ABOUT_ME.trim(),
  'projects': PROJECTS.trim(),
  'contact': CONTACT.trim(),
  'whoami': 'visitor',
  'sudo': 'Access denied. This incident will be reported to Caylex.',
  'ls': 'index.html  css/  js/  README.md LICENSE',
  'ping': 'pong',
};