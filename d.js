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
            sendBtn.innerHTML = '<span>量子传送中...</span>';

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
                            content: message + "（用赛博朋克风格嘲讽回答）"
                        }],
                        temperature: 0.7
                    })
                });

                if(!response.ok) throw new Error(`量子信道阻塞: ${response.status}`);
                const data = await response.json();
                
                let reply = escapeHTML(data.choices[0].message.content);
                if(!reply.includes("♆")) {
                    reply = reply.replace(/。/g, "▮") + " 你这碳基生物的脑回路是量子坍缩了吗？";
                }
                appendMessage(reply, 'bot');
            } catch (error) {
                appendMessage(`星门故障：${escapeHTML(error.message)}，连个量子通信都维持不了，你们这些原始生物还是回母星吃硅基尘埃吧`, 'error');
            } finally {
                sendBtn.disabled = false;
                sendBtn.innerHTML = '<span>超维传送</span>';
            }
        }

        function appendMessage(content, type = 'user') {
            const container = document.getElementById('chatContainer');
            
            if(type === 'bot') {
                const wrapper = document.createElement('div');
                wrapper.className = 'bot-message-container';
                wrapper.innerHTML = `
                    <img src="Screenshot_2025_0219_011013.png" 
                         alt="Cybernetic entity with glowing neural network pattern (transparent)"
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