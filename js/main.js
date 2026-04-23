const inputElement = document.getElementById('command-input');
const outputElement = document.getElementById('output');

// 终端初始化欢迎语
const WELCOME_MESSAGE = `
Welcome to CaylexOS v1.0.0 LTS (GNU/Linux 5.15.0-x86_64)

 * Documentation:  https://github.com/Caylex09
 * Welcome back to your homepage console.

Type 'help' to see all available commands.
======================================================
`;

// 输出处理函数
function printToTerminal(content, isCommand = false, commandText = '') {
    // 渲染用户输入历史
    if (isCommand) {
        outputElement.innerHTML += \`\n<div class="input-line"><span class="prompt">visitor@homepage:~$</span> \${commandText}</div>\`;
    }
    
    // 如果有响应文本，进行渲染
    if (content) {
        // 安全处理 HTML 标签，避免乱解析
        let formattedText = content.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        // 把其中长得像链接的内容解析为 <a> 标签
        formattedText = formattedText.replace(/(https?:\\/\\/[^\\s]+)/g, '<a href="$1" target="_blank">$1</a>');
        
        outputElement.innerHTML += \`\\n<div style="margin-bottom: 10px;">\${formattedText}</div>\`;
    }
    
    // 每打印一次都滚动到页面底部
    window.scrollTo(0, document.body.scrollHeight);
}

// 执行命令的核心逻辑
function executeCommand(rawCmd) {
    const cmdLower = rawCmd.trim().toLowerCase();

    // 处理空输入
    if (cmdLower === '') {
        printToTerminal('', true, '');
        return;
    }

    // 处理特殊自带命令: clear（清屏）
    if (cmdLower === 'clear') {
        outputElement.innerHTML = '';
        window.scrollTo(0, 0); // 滚回顶部
        return;
    }

    // 处理特殊自带命令: date（日期）
    if (cmdLower === 'date') {
        printToTerminal(new Date().toString(), true, rawCmd);
        return;
    }

    // 匹配 commands.js 中的指令
    const response = window.C_COMMANDS[cmdLower];
    
    if (response !== undefined) {
         printToTerminal(response, true, rawCmd);
    } else {
         printToTerminal(\`bash: \${rawCmd}: command not found\`, true, rawCmd);
    }
}

// 模拟敲击打字效果
async function autoTypeCommand(cmd) {
    inputElement.value = '';
    for (let i = 0; i < cmd.length; i++) {
        inputElement.value += cmd[i];
        // 降低每次打字的时间到20~50ms，看起来自然又快速
        await new Promise(r => setTimeout(r, Math.random() * 30 + 20)); 
    }
    await new Promise(r => setTimeout(r, 300)); // 停顿一会再回车
    
    inputElement.value = ''; // 清空
    executeCommand(cmd);
}

// 初次加载事件
window.addEventListener('DOMContentLoaded', async () => {
    printToTerminal(WELCOME_MESSAGE.trim());
    
    // 自动演示流程期间禁用输入
    inputElement.disabled = true;
    inputElement.blur();
    
    await new Promise(r => setTimeout(r, 600));
    await autoTypeCommand('whoami');
    
    await new Promise(r => setTimeout(r, 400));
    await autoTypeCommand('help');
    
    // 恢复输入并自动聚焦
    inputElement.disabled = false;
    inputElement.focus();
});

// 任何时候点击页面都会让输入框获取焦点
document.addEventListener('click', () => {
    if (!inputElement.disabled) {
        inputElement.focus();
    }
});

// 监听键盘按键
inputElement.addEventListener('keydown', function(event) {
    // 检查是否按下的是回车键
    if (event.key === 'Enter') {
        const rawCmd = this.value;
        this.value = ''; // 清空输入框
        executeCommand(rawCmd);
    }
});