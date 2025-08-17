import React, { useState, useEffect, useRef } from 'react';

const ChatInterfaceWeb = ({ userId, username = 'User' }) => {
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [showChoiceButtons, setShowChoiceButtons] = useState(false);
    const [rocketAnim, setRocketAnim] = useState(false);
    
    const messagesEndRef = useRef(null);
    const wsRef = useRef(null);
    const reconnectTimeoutRef = useRef(null);

    useEffect(() => {
        if (!userId) return;

        // Initialize chat with welcome message
        initializeChat();
        
        // Connect to WebSocket
        connectWebSocket();
        
        return () => {
            if (wsRef.current) {
                wsRef.current.close();
            }
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
        };
    }, [userId]);

    const initializeChat = () => {
        const welcomeMessage = {
            id: 'welcome-1',
            type: 'received',
            content: `🎉 Welcome ${username}! 

Ready to level up? Choose your path below! 🚀`,
            timestamp: new Date(),
            sender: 'Whop Owner',
            hasButtons: true // Flag to show buttons below this message
        };

        setMessages([welcomeMessage]);
        setIsLoading(false);
    };

    const connectWebSocket = () => {
        try {
            console.log('🔌 Connecting to Whop WebSocket...');
            setIsConnected(true);
            
        } catch (error) {
            console.error('❌ WebSocket connection failed:', error);
            setIsConnected(false);
            
            // Attempt to reconnect
            reconnectTimeoutRef.current = setTimeout(connectWebSocket, 5000);
        }
    };

    const handleWebSocketMessage = (message) => {
        try {
            console.log('📨 WebSocket message received:', message);
            
            if (message.type === 'interactive_buttons') {
                // Handle any future WebSocket messages here
            }
        } catch (error) {
            console.error('❌ Error handling WebSocket message:', error);
        }
    };

    const sendMessage = async () => {
        if (!inputText.trim()) return;

        const newMessage = {
            id: Date.now().toString(),
            type: 'sent',
            content: inputText,
            timestamp: new Date(),
            sender: username
        };

        setMessages(prev => [...prev, newMessage]);
        setInputText('');

        // Scroll to bottom
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);

        // Simulate response based on message content
        setTimeout(() => {
            handleUserMessage(inputText);
        }, 1000);
    };

    const handleUserMessage = (content) => {
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
                content: `Thanks! Reply with "dropshipping", "sports", or "crypto" to get started! 🚀`,
                timestamp: new Date(),
                sender: 'Whop Owner'
            };
            setMessages(prev => [...prev, defaultResponse]);
        }
    };

    const sendAutomatedResponse = (option) => {
        const responses = {
            'dropshipping': `🎯 Perfect! Here's your dropshipping starter pack:

📚 Free Course: https://your-affiliate-link.com/dropshipping-course
🛒 Shopify Trial: https://your-affiliate-link.com/shopify-trial
📊 Research Tool: https://your-affiliate-link.com/research-tool

Use code: DROPSHIP2024 for 20% off! 🚀`,

            'sports': `🏆 Excellent choice! Here's your sports package:

📊 Analytics: https://your-affiliate-link.com/sports-analytics
🎯 Strategy Guide: https://your-affiliate-link.com/betting-guide
📱 Mobile App: https://your-affiliate-link.com/sports-app

Use code: SPORTS2024 for 15% off! 💪`,

            'crypto': `💰 Smart choice! Here's your crypto starter kit:

📈 Trading Platform: https://your-affiliate-link.com/crypto-exchange
🎓 Education Course: https://your-affiliate-link.com/crypto-course
🔒 Hardware Wallet: https://your-affiliate-link.com/hardware-wallet

Use code: CRYPTO2024 for 25% off! 🚀`
        };

        const response = {
            id: Date.now().toString(),
            type: 'received',
            content: responses[option],
            timestamp: new Date(),
            sender: 'Whop Owner'
        };

        setMessages(prev => [...prev, response]);
    };

    const handleWelcomeButtonPress = () => {
        // Rocket launch animation
        setRocketAnim(true);
        setTimeout(() => setRocketAnim(false), 500);

        // Show choice buttons with animation
        setTimeout(() => {
            setShowChoiceButtons(true);
        }, 300);

        // Scroll to bottom
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    const handleChoiceButtonPress = async (button) => {
        // Hide choice buttons
        setShowChoiceButtons(false);

        // Add user's choice as a single message
        const userChoice = {
            id: Date.now().toString(),
            type: 'sent',
            content: `I want to learn ${button.id}`,
            timestamp: new Date(),
            sender: username
        };

        setMessages(prev => [...prev, userChoice]);

        // Scroll to bottom
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);

        // Send the choice to the server
        sendChoiceToServer(button);
        
        // Send automated response
        setTimeout(() => {
            sendAutomatedResponse(button.id);
        }, 1000);
    };

    const sendChoiceToServer = async (button) => {
        try {
            const response = await fetch('/api/button-response', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: userId,
                    username: username,
                    option: button.id
                })
            });

            if (response.ok) {
                const result = await response.json();
                console.log('✅ Choice sent successfully:', result);
            } else {
                console.error('❌ Failed to send choice:', response.status);
            }
        } catch (error) {
            console.error('❌ Error sending choice:', error);
        }
    };

    const handleLinkClick = (url) => {
        window.open(url, '_blank');
    };

    const renderMessageContent = (content) => {
        // Split content by URLs and render each part
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const parts = content.split(urlRegex);
        
        return parts.map((part, index) => {
            if (urlRegex.test(part)) {
                return (
                    <button
                        key={index}
                        className="gold-link-button"
                        onClick={() => handleLinkClick(part)}
                    >
                        <span className="gold-link-text">{part}</span>
                    </button>
                );
            } else {
                return (
                    <span key={index} className="message-text">
                        {part}
                    </span>
                );
            }
        });
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    if (isLoading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p className="loading-text">Loading chat...</p>
            </div>
        );
    }

    return (
        <div className="chat-container">
            {/* Header */}
            <div className="chat-header">
                <div className="header-info">
                    <h2 className="header-title">Whop Owner</h2>
                    <p className="header-subtitle">
                        {isConnected ? '🟢 Online' : '🔴 Offline'}
                    </p>
                </div>
            </div>

            {/* Messages */}
            <div className="messages-list">
                {messages.map((message) => (
                    <div 
                        key={message.id} 
                        className={`message-container ${message.type === 'sent' ? 'sent-message' : 'received-message'}`}
                    >
                        <div className={`message-bubble ${message.type === 'sent' ? 'sent-bubble' : 'received-bubble'}`}>
                            <div className="message-content">
                                {renderMessageContent(message.content)}
                            </div>
                            <span className="timestamp">
                                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            
                            {/* Welcome message buttons */}
                            {message.hasButtons && (
                                <div className="welcome-buttons-container">
                                    <button
                                        className={`welcome-button ${rocketAnim ? 'rocket-animate' : ''}`}
                                        onClick={handleWelcomeButtonPress}
                                    >
                                        🚀 Get Started
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Choice Buttons Container - Separate from messages */}
            {showChoiceButtons && (
                <div className="choice-buttons-overlay choice-buttons-animate">
                    <div className="choice-buttons-container">
                        <button
                            className="choice-button"
                            style={{ borderColor: '#667eea' }}
                            onClick={() => handleChoiceButtonPress({ id: 'dropshipping' })}
                        >
                            <span className="choice-button-icon">🛍️</span>
                            <div className="choice-button-content">
                                <span className="choice-button-text">🛍️ Dropshipping!</span>
                                <span className="choice-button-description">Learn how to start your own online store</span>
                            </div>
                        </button>
                        
                        <button
                            className="choice-button"
                            style={{ borderColor: '#764ba2' }}
                            onClick={() => handleChoiceButtonPress({ id: 'sports' })}
                        >
                            <span className="choice-button-icon">🏆</span>
                            <div className="choice-button-content">
                                <span className="choice-button-text">🏆 Sports!</span>
                                <span className="choice-button-description">Master sports betting and analysis</span>
                            </div>
                        </button>
                        
                        <button
                            className="choice-button"
                            style={{ borderColor: '#f093fb' }}
                            onClick={() => handleChoiceButtonPress({ id: 'crypto' })}
                        >
                            <span className="choice-button-icon">💰</span>
                            <div className="choice-button-content">
                                <span className="choice-button-text">💰 Crypto!</span>
                                <span className="choice-button-description">Dive into cryptocurrency trading</span>
                            </div>
                        </button>
                    </div>
                </div>
            )}

            {/* Input */}
            <div className="input-container">
                <textarea
                    className="text-input"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    rows="1"
                    maxLength="1000"
                />
                <button 
                    className={`send-button ${!inputText.trim() ? 'send-button-disabled' : ''}`}
                    onClick={sendMessage}
                    disabled={!inputText.trim()}
                >
                    Send
                </button>
            </div>

            <style jsx>{`
                .chat-container {
                    display: flex;
                    flex-direction: column;
                    height: 100vh;
                    background-color: #f8f9fa;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                }

                .loading-container {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    background-color: #f8f9fa;
                }

                .loading-spinner {
                    width: 40px;
                    height: 40px;
                    border: 4px solid #e9ecef;
                    border-top: 4px solid #667eea;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                .loading-text {
                    margin-top: 10px;
                    font-size: 16px;
                    color: #666;
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
            `}</style>
        </div>
    );
};

export default ChatInterfaceWeb;
