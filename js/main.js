const inputElement = document.getElementById('command-input');
const outputElement = document.getElementById('output');
const terminalBody = document.getElementById('terminal-body');

// 提取提示符的HTML并保持和页面DOM一致
const PROMPT_HTML = `<span class="prompt"><span class="user">visitor</span><span class="symbol">@</span><span class="host">caylex.dev</span><span class="symbol">:</span><span class="path">~</span><span class="symbol">$</span></span>`;

const WELCOME_MESSAGE = `
<span class="ascii-art">   ____            _           </span>
<span class="ascii-art">  / ___|__ _ _   _| | _____  __</span>
<span class="ascii-art"> | |   / _\` | | | | |/ _ \\ \\/ /</span>
<span class="ascii-art"> | |__| (_| | |_| | |  __/>  < </span>
<span class="ascii-art">  \\____\\__,_|\\__, |_|\\___/_/\\_\\</span>
<span class="ascii-art">             |___/             </span>

Welcome to my terminal. (Version 1.0.0)
This project's source code can be seen in <a href="https://github.com/Caylex09/profile" target="_blank">GitHub</a>.
For a list of available commands, type <span style="color:var(--host-color)">'help'</span>.
`;

function printToTerminal(content, isCommand = false, commandText = '') {
    if (isCommand) {
        outputElement.innerHTML += `<div class="input-line">${PROMPT_HTML}${commandText}</div>`;
    }

    if (content) {
        // 先替换原本的文本防止转义失效，但在欢迎信息等本身带HTML的直接放行
        let formattedText = content;
        if (!content.includes('<span class=')) {
            formattedText = formattedText.replace(/</g, "&lt;").replace(/>/g, "&gt;");
            formattedText = formattedText.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>');
        }

        outputElement.innerHTML += `<div>${formattedText}</div>`;
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

    if (cmdLower === 'poem') {
        // 先打印命令行占位
        printToTerminal('', true, rawCmd);

        fetch('https://v1.jinrishici.com/all.json')
            .then(res => res.json())
            .then(result => {
                const poemText = `${result.content} —— 【${result.author}】《${result.origin}》`;
                printToTerminal(`<span class="poem" style="color: #bd93f9;">${poemText}</span>`);
            })
            .catch(() => {
                printToTerminal('<span class="error" style="color: #ff5555;">Poem 获取失败</span>');
            });
        return;
    }

    const response = window.C_COMMANDS[cmdLower];

    if (response !== undefined) {
        // 允许 commands 输出原始文本避免直接走安全处理（如果在 command 里面带了颜色标签也可以支持）
        printToTerminal(response, true, rawCmd);
    } else {
        printToTerminal(`bash: ${rawCmd}: command not found`, true, rawCmd);
    }
}

// 终端历史记录与补全状态
let commandHistory = [];
let historyIndex = 0;

async function autoTypeCommand(cmd) {
    inputElement.value = '';
    for (let i = 0; i < cmd.length; i++) {
        inputElement.value += cmd[i];
        await new Promise(r => setTimeout(r, Math.random() * 40 + 30));
    }
    await new Promise(r => setTimeout(r, 400));

    inputElement.value = '';
    executeCommand(cmd);

    // 自动执行的指令也计入历史记录中
    if (cmd.trim() !== '') {
        commandHistory.push(cmd);
        historyIndex = commandHistory.length;
    }
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
    // 如果用户选中了网页上的文字，就不要强制把焦点拉回输入框，这样才能正常复制
    if (window.getSelection().toString() !== '') {
        return;
    }

    if (!inputElement.disabled) {
        inputElement.focus();
    }
});

inputElement.addEventListener('keydown', function (event) {
    // 1. 处理回车键执行
    if (event.key === 'Enter') {
        const rawCmd = this.value;
        this.value = '';
        executeCommand(rawCmd);

        // 如果输入不为空，计入历史记录，并将指针移到末尾
        if (rawCmd.trim() !== '') {
            commandHistory.push(rawCmd);
            historyIndex = commandHistory.length;
        }
        return;
    }

    // 2. 处理上键：查看上一次命令
    if (event.key === 'ArrowUp') {
        event.preventDefault(); // 阻止光标跳到开头
        if (historyIndex > 0) {
            historyIndex--;
            this.value = commandHistory[historyIndex];
        }
        return;
    }

    // 3. 处理下键：查看下一次命令（或清空）
    if (event.key === 'ArrowDown') {
        event.preventDefault(); // 阻止光标跳到末尾外的默认行为
        if (historyIndex < commandHistory.length - 1) {
            historyIndex++;
            this.value = commandHistory[historyIndex];
        } else if (historyIndex === commandHistory.length - 1) {
            historyIndex++;
            this.value = ''; // 已经是最后一条了，再往下就是空的新输入
        }
        return;
    }

    // 4. 处理 Tab 或 Ctrl+I：自动补全指令
    if (event.key === 'Tab' || (event.ctrlKey && event.key.toLowerCase() === 'i')) {
        event.preventDefault(); // 阻止浏览器切换焦点或默认快捷键

        const rawCmd = this.value.trimStart();
        const cmdLower = rawCmd.toLowerCase();

        if (!cmdLower) return;

        // 收集所有可用的命令集合
        const availableCommands = [...Object.keys(window.C_COMMANDS || {}), 'clear', 'date', 'poem'];
        // 筛选出前缀相同的命令
        const matches = availableCommands.filter(cmd => cmd.startsWith(cmdLower));

        if (matches.length === 1) {
            // 如果只有一个，直接精确补全（去除多余的尾部空格以符合真实终端期望）
            this.value = matches[0];
        } else if (matches.length > 1) {
            // 如果有多个匹配，直接把选项打印到终端之上（类似真实终端按双 Tab 的行为）
            printToTerminal(matches.join('    '), true, this.value);

            // 尝试补全它们最大的公共前缀（比如 a和ab 至少能补到a）
            let commonPrefix = matches[0];
            for (let i = 1; i < matches.length; i++) {
                let j = 0;
                while (j < commonPrefix.length && commonPrefix[j] === matches[i][j]) {
                    j++;
                }
                commonPrefix = commonPrefix.substring(0, j);
            }
            if (commonPrefix.length > cmdLower.length) {
                this.value = commonPrefix;
            }
        }
        return;
    }
});