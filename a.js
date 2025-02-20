        const escapeHTML = str => str.replace(/[&<>"']/g, 
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;'
            }[tag] || tag));

        const API_CONFIG = {
            endpoint: 'https://api.moonshot.cn/v1/chat/completions'
        };

        async function sendMessage() {
            const userInput = document.getElementById('userInput');
            const message = userInput.value.trim();
            if(!message) return;

            appendMessage(escapeHTML(message), 'user');
            userInput.value = '';
            
            const sendBtn = document.getElementById('sendBtn');
            sendBtn.disabled = true;
            sendBtn.innerHTML = '<span>发送</span>';

            try {
                const response = await fetch(API_CONFIG.endpoint, {
                    method: 'POST',
                    headers: {
                        'Authorization': `sk-acwvYxrYYhrYTH7qtK82pUzRFJEzqgotTCEnEcBMIuwq89Y9`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        model: "moonshot-v1-8k",
                        messages: [{
                            role: "user",
                            content: message + "（请用嘲讽语气回答）"
                        }],
                        temperature: 0.7
                    })
                });

                if(!response.ok) throw new Error(`HTTP错误: ${response.status}`);
                const data = await response.json();
                
                let reply = escapeHTML(data.choices[0].message.content);
                if(!reply.includes("♪")) {
                    reply = reply.replace(/。/g, "→傻子而已←") + " 傻逼！";
                }
                appendMessage(reply, 'bot');
            } catch (error) {
                appendMessage(`系统故障：${escapeHTML(error.message)}，你们这些傻逼乐子二球的死人设备都是印度买来的吧，连你们的爷爷都加载不出来`, 'error');
            } finally {
                sendBtn.disabled = false;
                sendBtn.innerHTML = '<span>发送</span>';
            }
        }

        function appendMessage(content, type = 'user') {
            const container = document.getElementById('chatContainer');
            
            if(type === 'bot') {
                const wrapper = document.createElement('div');
                wrapper.className = 'bot-message-container';
                wrapper.innerHTML = `
                    <img src=朗逸.png 
                         alt="你妈的什么傻逼破网连我的头像他妈的都加载不出来" 
                         class="avatar">
                    <div class="message bot-message">${content}</div>
                `;
                container.appendChild(wrapper);
            } else {
                const messageDiv = document.createElement('div');
                messageDiv.className = `message ${type}-message`;
                messageDiv.textContent = content;
                container.appendChild(messageDiv);
            }
            
            container.scrollTop = container.scrollHeight;
        }

        function handleKeyPress(e) {
            if(e.key === 'Enter') sendMessage();
        }