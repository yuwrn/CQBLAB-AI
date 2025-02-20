const API_CONFIG = {
    key: 'sk-acwvYxrYYhrYTH7qtK82pUzRFJEzqgotTCEnEcBMIuwq89Y9',
    endpoint: 'https://api.moonshot.cn/v1/chat/completions'
};

document.addEventListener('DOMContentLoaded', () => {
    const sendBtn = document.getElementById('sendBtn');
    const userInput = document.getElementById('userInput');

    sendBtn.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', e => e.key === 'Enter' && sendMessage());
});

async function sendMessage() {
    const userInput = document.getElementById('userInput');
    const message = userInput.value.trim();
    if (!message) return;

    appendMessage(message, 'user');
    userInput.value = '';
    
    const sendBtn = document.getElementById('sendBtn');
    sendBtn.disabled = true;
    sendBtn.textContent = '思考中...';

    try {
        const response = await fetch(API_CONFIG.endpoint, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_CONFIG.key}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "moonshot-v1-8k",
                messages: [{ role: "user", content: message }],
                temperature: 0.3
            })
        });

        if (!response.ok) throw new Error(`请求失败: ${response.status}`);
        await response.json();
        appendMessage("Null", 'bot');
    } catch (error) {
        appendMessage(`错误: ${error.message}`, 'error');
    } finally {
        sendBtn.disabled = false;
        sendBtn.textContent = '发送';
    }
}

function appendMessage(content, type = 'user') {
    const container = document.getElementById('chatContainer');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}-message`;
    messageDiv.textContent = content;
    container.appendChild(messageDiv);
    container.scrollTop = container.scrollHeight;
}
