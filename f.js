        const sendBtn = document.getElementById('sendBtn');
        const messageInput = document.getElementById('messageInput');
        const messageCloud = document.getElementById('messageCloud');

        // Moonshot AI API 的配置信息
        const apiKey = 'sk-acwvYxrYYhrYTH7qtK82pUzRFJEzqgotTCEnEcBMIuwq89Y9'; // 你的 API 密钥
        const apiEndpoint = 'https://api.moonshot.cn/v1/chat/completions'; // API 端点

        sendBtn.addEventListener('click', async () => {
            const message = messageInput.value.trim();
            if(message) {
                // 用户消息
                const userBubble = document.createElement('div');
                userBubble.className = 'bubble user-bubble';
                userBubble.textContent = message;
                messageCloud.appendChild(userBubble);
                messageCloud.scrollTop = messageCloud.scrollHeight; // 滚动到底部

                // 通过 Moonshot AI API 获取回复
                try {
                    const response = await fetch(apiEndpoint, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${apiKey}`
                        },
                        body: JSON.stringify({
                            model: 'moonshot-v1-8k', // 使用的模型名称，根据 Moonshot AI 提供的文档进行调整
                            messages: [
                                { role: 'system', content: '你是一个可爱的猫咪助手，名叫喵小萌。请用可爱的语气回复用户的消息。' }, // 系统消息，用于设定助手的角色和语气
                                { role: 'user', content: message } // 用户消息
                            ],
                            stream: false // 是否流式传输回复，这里设置为 false 表示一次性返回完整的回复
                        })
                    });
                    const data = await response.json(); // 解析返回的 JSON 数据
                    const assistantMessage = data.choices[0].message.content; // 获取助手的回复内容

                    // 显示助手的回复
                    setTimeout(() => {
                        const catBubble = document.createElement('div');
                        catBubble.className = 'bubble cat-bubble';
                        catBubble.textContent = assistantMessage; // 将助手的回复显示在气泡中
                        messageCloud.appendChild(catBubble);
                        messageCloud.scrollTop = messageCloud.scrollHeight; // 滚动到底部
                    }, 800); // 模拟回复延迟
                } catch (error) {
                    console.error('Error fetching response from Moonshot AI API:', error); // 处理可能的错误情况
                    // 在实际应用中，你可能需要向用户显示一个错误消息或提供一个备用的回复方案
                }

                messageInput.value = ''; // 清空输入框
            }
        });

        // 回车发送
        messageInput.addEventListener('keypress', (e) => {
            if(e.key === 'Enter') sendBtn.click(); // 按下回车键时触发发送按钮的点击事件
        });