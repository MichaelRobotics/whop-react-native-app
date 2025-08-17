const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.static('public'));

// Note: Messaging functionality has been moved to api/webhook.js
// This preview server is for development/testing only

// Note: Webhook functionality has been moved to api/webhook.js
// This preview server is for development/testing only

// Create the HTML preview page with chat interface
const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Whop Chat App</title>
    <script>
        // Handle iframe context - prevent recursive display
        if (window.self !== window.top) {
            // We're in an iframe - this is correct
            console.log('📱 App loaded in Whop iframe');
        } else {
            // We're not in an iframe - redirect to Whop
            if (!window.location.search.includes('whop_user_id') && !window.location.search.includes('preview=true')) {
                window.location.href = 'https://whop.com/apps/app_FInBMCJGyVdD9T';
            }
        }
    </script>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: #f8f9fa;
            height: 100vh;
            overflow: hidden;
            margin: 0;
            padding: 0;
        }
        
        /* Ensure we're in the iframe context */
        html, body {
            width: 100%;
            height: 100%;
            overflow: hidden;
        }
        
        .chat-container {
            display: flex;
            flex-direction: column;
            height: 100vh;
            background-color: #f8f9fa;
        }

        .chat-header {
            background-color: white;
            padding: 15px 20px;
            border-bottom: 1px solid #e9ecef;
            display: flex;
            align-items: center;
        }

        .header-info {
            flex: 1;
        }

        .header-title {
            font-size: 18px;
            font-weight: bold;
            color: #1a1a1a;
            margin: 0;
        }

        .header-subtitle {
            font-size: 14px;
            color: #666;
            margin: 2px 0 0 0;
        }

        .messages-list {
            flex: 1;
            overflow-y: auto;
            padding: 15px;
        }

        .message-container {
            margin: 5px 0;
            display: flex;
        }

        .sent-message {
            justify-content: flex-end;
        }

        .received-message {
            justify-content: flex-start;
        }

        .message-bubble {
            max-width: 80%;
            padding: 10px 15px;
            border-radius: 20px;
            position: relative;
        }

        .sent-bubble {
            background-color: rgba(102, 126, 234, 0.9); /* More transparent */
            border-bottom-right-radius: 5px;
        }

        .received-bubble {
            background-color: white;
            border-bottom-left-radius: 5px;
            border: 1px solid #e9ecef;
        }

        .message-content {
            display: flex;
            flex-wrap: wrap;
            align-items: flex-start;
        }

        .message-text {
            font-size: 16px;
            line-height: 22px;
            color: #1a1a1a;
        }

        .sent-bubble .message-text {
            color: white;
        }

        .gold-link-button {
            background: none;
            border: none;
            padding: 0;
            margin: 2px 1px;
            cursor: pointer;
            display: inline-block;
        }

        .gold-link-text {
            background-color: rgba(255, 215, 0, 0.1);
            border: 1px solid rgba(255, 215, 0, 0.6);
            border-radius: 8px;
            padding: 4px 8px;
            font-size: 14px;
            color: #1a1a1a;
            text-decoration: underline;
            font-weight: 500;
            display: inline-block;
            box-shadow: 0 2px 4px rgba(255, 215, 0, 0.3);
            animation: goldShimmer 4s ease-in-out infinite;
        }

        .gold-link-text::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(
                90deg,
                transparent,
                rgba(255, 215, 0, 0.4),
                transparent
            );
            animation: shimmer 3s infinite;
        }

        @keyframes goldShimmer {
            0%, 100% {
                border-color: rgba(255, 215, 0, 0.6);
                box-shadow: 0 2px 4px rgba(255, 215, 0, 0.3);
            }
            50% {
                border-color: rgba(255, 215, 0, 0.9);
                box-shadow: 0 4px 8px rgba(255, 215, 0, 0.5);
            }
        }

        @keyframes shimmer {
            0% {
                left: -100%;
            }
            100% {
                left: 100%;
            }
        }

        .timestamp {
            font-size: 12px;
            color: #999;
            margin-top: 5px;
            display: block;
            text-align: right;
        }

        .welcome-buttons-container {
            margin-top: 15px;
            text-align: center;
        }

        .welcome-button {
            background-color: #667eea;
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 25px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }

        .welcome-button:hover {
            background-color: #5a6fd8;
            transform: translateY(-2px);
        }

        .welcome-button.rocket-animate {
            animation: rocketLaunch 0.5s ease-in-out;
        }

        @keyframes rocketLaunch {
            0% { transform: scale(1); }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); }
        }

        .choice-buttons-overlay {
            position: absolute;
            bottom: 80px;
            left: 20px;
            right: 20px;
            z-index: 1000;
        }

        .choice-buttons-animate {
            animation: choiceButtonsSlideIn 0.5s ease-out;
        }

        @keyframes choiceButtonsSlideIn {
            from {
                opacity: 0;
                transform: translateY(50px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .choice-buttons-container {
            background-color: rgba(255, 255, 255, 0.95);
            border-radius: 20px;
            padding: 20px;
            box-shadow: 0 8px 30px rgba(0,0,0,0.15);
            border: 1px solid rgba(0,0,0,0.05);
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .choice-button {
            display: flex;
            align-items: center;
            padding: 16px;
            border-radius: 16px;
            border: 2px solid;
            background-color: white;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 3px 12px rgba(0,0,0,0.15);
            min-height: 60px;
        }

        .choice-button:hover {
            transform: translateY(-3px);
            box-shadow: 0 6px 20px rgba(0,0,0,0.2);
        }

        .choice-button:active {
            transform: scale(0.98);
        }

        .choice-button-icon {
            font-size: 22px;
            margin-right: 12px;
        }

        .choice-button-content {
            flex: 1;
            text-align: left;
        }

        .choice-button-text {
            display: block;
            font-size: 16px;
            font-weight: bold;
            color: #1a1a1a;
            margin-bottom: 3px;
        }

        .choice-button-description {
            display: block;
            font-size: 14px;
            color: #666;
            line-height: 16px;
        }

        .input-container {
            display: flex;
            align-items: flex-end;
            padding: 15px;
            background-color: white;
            border-top: 1px solid #e9ecef;
            gap: 10px;
        }

        .text-input {
            flex: 1;
            background-color: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 20px;
            padding: 10px 15px;
            font-size: 16px;
            resize: none;
            max-height: 100px;
            font-family: inherit;
        }

        .text-input:focus {
            outline: none;
            border-color: #667eea;
        }

        .send-button {
            background-color: #667eea;
            color: white;
            border: none;
            border-radius: 20px;
            padding: 10px 20px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: background-color 0.2s;
        }

        .send-button:hover:not(.send-button-disabled) {
            background-color: #5a6fd8;
        }

        .send-button-disabled {
            background-color: #ccc;
            cursor: not-allowed;
        }

        .hidden {
            display: none;
        }
    </style>
</head>
<body>
    <div class="chat-container">
        <!-- Header -->
        <div class="chat-header">
            <div class="header-info">
                <h2 class="header-title">Whop Owner</h2>
                <p class="header-subtitle" id="connection-status">🟢 Online</p>
            </div>
        </div>

        <!-- Messages -->
        <div class="messages-list" id="messages-list">
            <div class="message-container received-message">
                <div class="message-bubble received-bubble">
                    <div class="message-content">
                        <span class="message-text">🎉 Welcome User! 

Ready to level up? Choose your path below! 🚀</span>
                    </div>
                    <span class="timestamp">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    
                    <!-- Welcome message buttons -->
                    <div class="welcome-buttons-container">
                        <button class="welcome-button" onclick="handleWelcomeButtonPress()">
                            🚀 Get Started
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Choice Buttons Container - Separate from messages -->
        <div class="choice-buttons-overlay hidden" id="choice-buttons-overlay">
            <div class="choice-buttons-container">
                <button class="choice-button" style="border-color: #667eea;" onclick="handleChoiceButtonPress('dropshipping')">
                    <span class="choice-button-icon">🛍️</span>
                    <div class="choice-button-content">
                        <span class="choice-button-text">🛍️ Dropshipping!</span>
                        <span class="choice-button-description">Learn how to start your own online store</span>
                    </div>
                </button>
                <button class="choice-button" style="border-color: #764ba2;" onclick="handleChoiceButtonPress('sports')">
                    <span class="choice-button-icon">🏆</span>
                    <div class="choice-button-content">
                        <span class="choice-button-text">🏆 Sports!</span>
                        <span class="choice-button-description">Master sports betting and analysis</span>
                    </div>
                </button>
                <button class="choice-button" style="border-color: #f093fb;" onclick="handleChoiceButtonPress('crypto')">
                    <span class="choice-button-icon">💰</span>
                    <div class="choice-button-content">
                        <span class="choice-button-text">💰 Crypto!</span>
                        <span class="choice-button-description">Dive into cryptocurrency trading</span>
                    </div>
                </button>
            </div>
        </div>

        <!-- Input -->
        <div class="input-container">
            <textarea
                class="text-input"
                id="text-input"
                placeholder="Type a message..."
                rows="1"
                maxlength="1000"
                onkeypress="handleKeyPress(event)"
            ></textarea>
            <button 
                class="send-button"
                id="send-button"
                onclick="sendMessage()"
            >
                Send
            </button>
        </div>
    </div>
    
    <script>
        let messages = [];
        let isConnected = true;
        let rocketAnim = false;
        let showChoiceButtons = false;

        // Initialize chat
        function initializeChat() {
            const welcomeMessage = {
                id: 'welcome-1',
                type: 'received',
                content: \`🎉 Welcome User! 

Ready to level up? Choose your path below! 🚀\`,
                timestamp: new Date(),
                sender: 'Whop Owner',
                hasButtons: true
            };
            messages = [welcomeMessage];
        }

        // Handle welcome button press
        function handleWelcomeButtonPress() {
            // Rocket launch animation
            const button = document.querySelector('.welcome-button');
            button.classList.add('rocket-animate');
            setTimeout(() => button.classList.remove('rocket-animate'), 500);

            // Show choice buttons with animation
            setTimeout(() => {
                showChoiceButtons = true;
                const overlay = document.getElementById('choice-buttons-overlay');
                overlay.classList.remove('hidden');
                overlay.classList.add('choice-buttons-animate');
            }, 300);
        }

        // Handle choice button press
        function handleChoiceButtonPress(option) {
            // Hide choice buttons
            showChoiceButtons = false;
            const overlay = document.getElementById('choice-buttons-overlay');
            overlay.classList.add('hidden');
            overlay.classList.remove('choice-buttons-animate');

            const userChoice = {
                id: Date.now().toString(),
                type: 'sent',
                content: \`I want to learn \${option}\`,
                timestamp: new Date(),
                sender: 'User'
            };
            
            addMessage(userChoice);
            
            // Send automated response
            setTimeout(() => {
                sendAutomatedResponse(option);
            }, 1000);
        }

        // Send automated response
        function sendAutomatedResponse(option) {
            const responses = {
                'dropshipping': \`🎯 Perfect! Here's your dropshipping starter pack:

📚 Free Course: https://your-affiliate-link.com/dropshipping-course
🛒 Shopify Trial: https://your-affiliate-link.com/shopify-trial
📊 Research Tool: https://your-affiliate-link.com/research-tool

Use code: DROPSHIP2024 for 20% off! 🚀\`,

                'sports': \`🏆 Excellent choice! Here's your sports package:

📊 Analytics: https://your-affiliate-link.com/sports-analytics
🎯 Strategy Guide: https://your-affiliate-link.com/betting-guide
📱 Mobile App: https://your-affiliate-link.com/sports-app

Use code: SPORTS2024 for 15% off! 💪\`,

                'crypto': \`💰 Smart choice! Here's your crypto starter kit:

📈 Trading Platform: https://your-affiliate-link.com/crypto-exchange
🎓 Education Course: https://your-affiliate-link.com/crypto-course
🔒 Hardware Wallet: https://your-affiliate-link.com/hardware-wallet

Use code: CRYPTO2024 for 25% off! 🚀\`
            };

            const response = {
                id: Date.now().toString(),
                type: 'received',
                content: responses[option],
                timestamp: new Date(),
                sender: 'Whop Owner'
            };
            
            addMessage(response);
        }

        // Add message to chat
        function addMessage(message) {
            messages.push(message);
            renderMessages();
        }

        // Handle link click
        function handleLinkClick(url) {
            window.open(url, '_blank');
        }

        // Render message content with gold links
        function renderMessageContent(content) {
            const urlRegex = /(https?:\/\/[^\s]+)/g;
            const parts = content.split(urlRegex);
            
            let html = '';
            parts.forEach((part, index) => {
                if (urlRegex.test(part)) {
                    html += \`<button class="gold-link-button" onclick="handleLinkClick('\${part}')">
                        <span class="gold-link-text">\${part}</span>
                    </button>\`;
                } else {
                    html += \`<span class="message-text">\${part}</span>\`;
                }
            });
            return html;
        }

        // Render all messages
        function renderMessages() {
            const messagesList = document.getElementById('messages-list');
            messagesList.innerHTML = messages.map((message, index) => {
                let buttonsHtml = '';
                
                if (message.hasButtons) {
                    buttonsHtml = \`
                        <div class="welcome-buttons-container">
                            <button class="welcome-button" onclick="handleWelcomeButtonPress()">
                                🚀 Get Started
                            </button>
                        </div>
                    \`;
                }
                
                return \`
                    <div class="message-container \${message.type === 'sent' ? 'sent-message' : 'received-message'}">
                        <div class="message-bubble \${message.type === 'sent' ? 'sent-bubble' : 'received-bubble'}">
                            <div class="message-content">
                                \${renderMessageContent(message.content)}
                            </div>
                            <span class="timestamp">\${message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            \${buttonsHtml}
                        </div>
                    </div>
                \`;
            }).join('');
            
            // Scroll to bottom
            messagesList.scrollTop = messagesList.scrollHeight;
        }

        // Send message
        function sendMessage() {
            const input = document.getElementById('text-input');
            const text = input.value.trim();
            
            if (!text) return;
            
            const message = {
                id: Date.now().toString(),
                type: 'sent',
                content: text,
                timestamp: new Date(),
                sender: 'User'
            };
            
            addMessage(message);
            input.value = '';
            
            // Handle response
            setTimeout(() => {
                handleUserMessage(text);
            }, 1000);
        }

        // Handle user message
        function handleUserMessage(content) {
            const lowerContent = content.toLowerCase();
            
            if (lowerContent.includes('dropshipping')) {
                sendAutomatedResponse('dropshipping');
            } else if (lowerContent.includes('sports')) {
                sendAutomatedResponse('sports');
            } else if (lowerContent.includes('crypto')) {
                sendAutomatedResponse('crypto');
            } else {
                // Default response
                const defaultResponse = {
                    id: Date.now().toString(),
                    type: 'received',
                    content: \`Thanks! Reply with "dropshipping", "sports", or "crypto" to get started! 🚀\`,
                    timestamp: new Date(),
                    sender: 'Whop Owner'
                };
                addMessage(defaultResponse);
            }
        }

        // Handle key press
        function handleKeyPress(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        }

        // Initialize
        initializeChat();
        console.log('🚀 Whop Chat App loaded');
        console.log('📍 Current URL:', window.location.href);
        console.log('🖼️ In iframe:', window.self !== window.top);
        console.log('📱 User agent:', navigator.userAgent);
    </script>
</body>
</html>`;

// Routes - Serverless-compatible (serve HTML directly instead of writing to filesystem)
app.get('/', (req, res) => {
    // In production, only allow Whop requests
    if (process.env.NODE_ENV === 'production') {
        const isWhopRequest = req.headers['user-agent']?.includes('Whop') || 
                             req.query.whop_user_id || 
                             req.headers['x-whop-signature'];
        
        if (!isWhopRequest) {
            // Redirect unauthorized users to Whop
            return res.redirect('https://whop.com/apps/app_FInBMCJGyVdD9T');
        }
    }
    
    // Serve the main app preview for authorized users
    res.send(htmlContent);
});

app.get('/api/preview-info', (req, res) => {
    res.json({
        message: 'Whop Chat App Preview Server',
        status: 'running',
        timestamp: new Date().toISOString(),
        appInfo: {
            name: 'Chat App',
            version: '1.0.0',
            type: 'Whop React Native App',
            features: ['Interactive Chat', 'WebSocket Integration', 'Automated Responses']
        }
    });
});

// Experience route for testing - serves the visual preview
app.get('/experiences/:experienceId', (req, res) => {
    const experienceId = req.params.experienceId;
    
    // Serve the same chat interface for all experiences
    res.send(htmlContent);
});

// Start server
app.listen(PORT, () => {
    console.log(`
🚀 Whop Chat App Preview Server
==========================================
✅ Server running at: http://localhost:${PORT}
📱 Chat interface available at:
   - http://localhost:${PORT} (Main Chat)
   - http://localhost:${PORT}/experiences/:id (Experience Chat)

💡 This server now shows the interactive chat interface!
    `);
});
