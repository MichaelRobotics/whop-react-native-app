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
            opacity: 0;
            transform: translateY(20px);
            animation: messageSlideIn 0.5s ease-out forwards;
        }

        @keyframes messageSlideIn {
            to {
                opacity: 1;
                transform: translateY(0);
            }
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

        .message-text {
            font-size: 16px;
            line-height: 22px;
            margin: 0;
            white-space: pre-wrap;
        }

        .sent-text {
            color: white;
        }

        .received-text {
            color: #1a1a1a;
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

        .choice-buttons-container {
            margin-top: 15px;
            display: flex;
            flex-direction: column;
            gap: 12px; /* Increased gap for larger buttons */
        }

        .choice-button {
            display: flex;
            align-items: center;
            padding: 16px; /* Increased padding for larger buttons */
            border-radius: 16px; /* Increased border radius */
            border: none;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 3px 12px rgba(0,0,0,0.15);
            min-height: 60px; /* Minimum height for larger buttons */
        }

        .choice-button:hover {
            transform: translateY(-3px);
            box-shadow: 0 6px 20px rgba(0,0,0,0.2);
        }

        .choice-button:active {
            transform: scale(0.98);
        }

        .choice-button-icon {
            font-size: 22px; /* Larger icon */
            margin-right: 12px;
        }

        .choice-button-content {
            flex: 1;
            text-align: left;
        }

        .choice-button-text {
            display: block;
            font-size: 16px; /* Larger text */
            font-weight: bold;
            color: white;
            margin-bottom: 3px;
        }

        .choice-button-description {
            display: block;
            font-size: 14px; /* Larger description */
            color: rgba(255,255,255,0.9);
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
            <div class="message-container received-message" style="animation-delay: 0s;">
                <div class="message-bubble received-bubble">
                    <p class="message-text received-text">🎉 Welcome to our community, User! 

Thank you for joining us! I'm excited to have you on board.

Here's what you can expect:
• Access to exclusive content
• Community discussions
• Regular updates and new features

If you have any questions, feel free to reach out to me directly.

Welcome aboard! 🚀</p>
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

        // Initialize chat
        function initializeChat() {
            const welcomeMessage = {
                id: 'welcome-1',
                type: 'received',
                content: \`🎉 Welcome to our community, User! 

Thank you for joining us! I'm excited to have you on board.

Here's what you can expect:
• Access to exclusive content
• Community discussions
• Regular updates and new features

If you have any questions, feel free to reach out to me directly.

Welcome aboard! 🚀\`,
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

            const userChoice = {
                id: Date.now().toString(),
                type: 'sent',
                content: 'I want to:',
                timestamp: new Date(),
                sender: 'User',
                hasChoiceButtons: true
            };
            
            addMessage(userChoice);
        }

        // Handle choice button press
        function handleChoiceButtonPress(option) {
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
                'dropshipping': \`🎯 Perfect choice, User! 

Dropshipping is one of the fastest ways to start an online business with minimal investment.

Here's your exclusive starter pack:
• 📚 Free Dropshipping Course: https://your-affiliate-link.com/dropshipping-course
• 🛒 Shopify 14-Day Trial: https://your-affiliate-link.com/shopify-trial
• 📊 Product Research Tool: https://your-affiliate-link.com/research-tool

Use promo code: DROPSHIP2024 for 20% off!

Ready to start your dropshipping journey? Let me know if you need help! 🚀\`,

                'sports': \`🏆 Excellent choice, User! 

Sports betting and analysis can be incredibly profitable when done right.

Here's your exclusive sports package:
• 📊 Sports Analytics Platform: https://your-affiliate-link.com/sports-analytics
• 🎯 Betting Strategy Guide: https://your-affiliate-link.com/betting-guide
• 📱 Mobile App Access: https://your-affiliate-link.com/sports-app

Use promo code: SPORTS2024 for 15% off!

Want to learn more about sports analysis? I'm here to help! 💪\`,

                'crypto': \`💰 Smart choice, User! 

Cryptocurrency is the future of finance and there's never been a better time to get started.

Here's your exclusive crypto starter kit:
• 📈 Trading Platform: https://your-affiliate-link.com/crypto-exchange
• 🎓 Crypto Education Course: https://your-affiliate-link.com/crypto-course
• 🔒 Hardware Wallet: https://your-affiliate-link.com/hardware-wallet

Use promo code: CRYPTO2024 for 25% off!

Ready to dive into the crypto world? Let's make it happen! 🚀\`
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
                
                if (message.hasChoiceButtons) {
                    buttonsHtml = \`
                        <div class="choice-buttons-container">
                            <button class="choice-button" style="background-color: #667eea;" onclick="handleChoiceButtonPress('dropshipping')">
                                <span class="choice-button-icon">🛍️</span>
                                <div class="choice-button-content">
                                    <span class="choice-button-text">🛍️ Dropshipping!</span>
                                    <span class="choice-button-description">Learn how to start your own online store</span>
                                </div>
                            </button>
                            <button class="choice-button" style="background-color: #764ba2;" onclick="handleChoiceButtonPress('sports')">
                                <span class="choice-button-icon">🏆</span>
                                <div class="choice-button-content">
                                    <span class="choice-button-text">🏆 Sports!</span>
                                    <span class="choice-button-description">Master sports betting and analysis</span>
                                </div>
                            </button>
                            <button class="choice-button" style="background-color: #f093fb;" onclick="handleChoiceButtonPress('crypto')">
                                <span class="choice-button-icon">💰</span>
                                <div class="choice-button-content">
                                    <span class="choice-button-text">💰 Crypto!</span>
                                    <span class="choice-button-description">Dive into cryptocurrency trading</span>
                                </div>
                            </button>
                        </div>
                    \`;
                }
                
                return \`
                    <div class="message-container \${message.type === 'sent' ? 'sent-message' : 'received-message'}" style="animation-delay: \${index * 0.1}s;">
                        <div class="message-bubble \${message.type === 'sent' ? 'sent-bubble' : 'received-bubble'}">
                            <p class="message-text \${message.type === 'sent' ? 'sent-text' : 'received-text'}">\${message.content}</p>
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
                    content: \`Thanks for your message! I'm here to help you succeed. 

If you're interested in learning more, you can reply with:
• "Dropshipping" - for e-commerce resources
• "Sports" - for sports betting & analysis
• "Crypto" - for cryptocurrency trading

What interests you most? 🚀\`,
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
