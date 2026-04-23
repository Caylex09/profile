const inputElement = document.getElementById('command-input');
const outputElement = document.getElementById('output');
const terminalBody = document.getElementById('terminal-body');

// 提取提示符的HTML并保持和页面DOM一致
const PROMPT_HTML = \`<span class="prompt"><span class="user">visitor</span><span class="symbol">@</span><span class="host">caylex.dev</span><span class="symbol">:</span><span class="path">~</span><span class="symbol">$</span></span>\`;

const WELCOME_MESSAGE = \`
<span class="ascii-art">   ____            _           </span>
<span class="ascii-art">  / ___|__ _ _   _| | _____  __</span>
<span class="ascii-art"> | |   / _\` | | | | |/ _ \\ \\/ /</span>
<span class="ascii-art"> | |__| (_| | |_| | |  __/>  < </span>
<span class="ascii-art">  \\____\\__,_|\\__, |_|\\___/_/\\_\\</span>
<span class="ascii-art">             |___/             </span>

Welcome to my terminal portfolio. (Version 1.0.0)
----
This project's source code can be seen in <a href="https://github.com/Caylex09" target="_blank">GitHub</a>.
----
For a list of available commands, type <span style="color:var(--host-color)">'help'</span>.
\`;

function printToTerminal(content, isCommand = false, commandText = '') {
    if (isCommand) {
        outputElement.innerHTML += \`\\n<div class="input-line">\${PROMPT_HTML} \${commandText}</div>\`;
    }
    
    if (content) {
        // 先替换原本的文本防止转义失效，但在欢迎信息等本身带HTML的直接放行
        let formattedText = content;
        if (!content.includes('<span class=')) {
            formattedText = formattedText.replace(/</g, "&lt;").replace(/>/g, "&gt;");
            formattedText = formattedText.replace(/(https?:\\/\\/[^\\s]+)/g, '<a href="$1" target="_blank">$1</a>');
        }
        
        outputElement.innerHTML += \`\\n<div style="margin-bottom: 10px;">\${formattedText}</div>\`;
    }
    
    // 我们使用了内嵌滚动框（因为加了窗口外壳）
    terminalBody.scrollTop = terminalBody.scrollHeight;
}

function executeCommand(rawCmd) {
    const cmdLower = rawCmd.trim().toLowerCase();

    if (cmdLower === '') {
        printToTerminal('', true, '');
        return;
    }

    if (cmdLower === 'clear') {
        outputElement.innerHTML = '';
        terminalBody.scrollTop = 0;
        return;
    }

    if (cmdLower === 'date') {
        printToTerminal(new Date().toString(), true, rawCmd);
        return;
    }

    const response = window.C_COMMANDS[cmdLower];
    
    if (response !== undefined) {
        // 允许 commands 输出原始文本避免直接走安全处理（如果在 command 里面带了颜色标签也可以支持）
        printToTerminal(response, true, rawCmd);
    } else {
        printToTerminal(\`bash: \${rawCmd}: command not found\`, true, rawCmd);
    }
}

async function autoTypeCommand(cmd) {
    inputElement.value = '';
    for (let i = 0; i < cmd.length; i++) {
        inputElement.value += cmd[i];
        await new Promise(r => setTimeout(r, Math.random() * 40 + 30)); 
    }
    await new Promise(r => setTimeout(r, 400)); 
    
    inputElement.value = '';
    executeCommand(cmd);
}

window.addEventListener('DOMContentLoaded', async () => {
    printToTerminal(WELCOME_MESSAGE.trim());
    
    inputElement.disabled = true;
    inputElement.blur();
    
    await new Promise(r => setTimeout(r, 600));
    await autoTypeCommand('whoami');
    
    await new Promise(r => setTimeout(r, 400));
    await autoTypeCommand('help');
    
    inputElement.disabled = false;
    inputElement.focus();
});

document.addEventListener('click', () => {
    if (!inputElement.disabled) {
        inputElement.focus();
    }
});

inputElement.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        const rawCmd = this.value;
        this.value = ''; 
        executeCommand(rawCmd);
    }
});