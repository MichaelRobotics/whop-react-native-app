import React, { useState, useEffect, useRef } from 'react';
import { 
    View, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    FlatList, 
    StyleSheet, 
    Animated, 
    Dimensions, 
    KeyboardAvoidingView, 
    Platform,
    Alert,
    ActivityIndicator
} from 'react-native';

const { width, height } = Dimensions.get('window');

const ChatInterface = ({ userId, username = 'User' }) => {
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [showChoiceButtons, setShowChoiceButtons] = useState(false);
    
    // Animation values
    const slideAnim = new Animated.Value(-width);
    const fadeAnim = new Animated.Value(0);
    const scaleAnim = new Animated.Value(0.8);
    const rocketAnim = new Animated.Value(0);
    const messageSlideAnim = new Animated.Value(50);
    const messageFadeAnim = new Animated.Value(0);
    
    const flatListRef = useRef(null);
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
            content: `🎉 Welcome to our community, ${username}! 

Thank you for joining us! I'm excited to have you on board.

Here's what you can expect:
• Access to exclusive content
• Community discussions
• Regular updates and new features

If you have any questions, feel free to reach out to me directly.

Welcome aboard! 🚀`,
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
            flatListRef.current?.scrollToEnd({ animated: true });
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
                content: `Thanks for your message! I'm here to help you succeed. 

If you're interested in learning more, you can reply with:
• "Dropshipping" - for e-commerce resources
• "Sports" - for sports betting & analysis
• "Crypto" - for cryptocurrency trading

What interests you most? 🚀`,
                timestamp: new Date(),
                sender: 'Whop Owner'
            };
            setMessages(prev => [...prev, defaultResponse]);
        }
    };

    const sendAutomatedResponse = (option) => {
        const responses = {
            'dropshipping': `🎯 Perfect choice, ${username}! 

Dropshipping is one of the fastest ways to start an online business with minimal investment.

Here's your exclusive starter pack:
• 📚 Free Dropshipping Course: https://your-affiliate-link.com/dropshipping-course
• 🛒 Shopify 14-Day Trial: https://your-affiliate-link.com/shopify-trial
• 📊 Product Research Tool: https://your-affiliate-link.com/research-tool

Use promo code: DROPSHIP2024 for 20% off!

Ready to start your dropshipping journey? Let me know if you need help! 🚀`,

            'sports': `🏆 Excellent choice, ${username}! 

Sports betting and analysis can be incredibly profitable when done right.

Here's your exclusive sports package:
• 📊 Sports Analytics Platform: https://your-affiliate-link.com/sports-analytics
• 🎯 Betting Strategy Guide: https://your-affiliate-link.com/betting-guide
• 📱 Mobile App Access: https://your-affiliate-link.com/sports-app

Use promo code: SPORTS2024 for 15% off!

Want to learn more about sports analysis? I'm here to help! 💪`,

            'crypto': `💰 Smart choice, ${username}! 

Cryptocurrency is the future of finance and there's never been a better time to get started.

Here's your exclusive crypto starter kit:
• 📈 Trading Platform: https://your-affiliate-link.com/crypto-exchange
• 🎓 Crypto Education Course: https://your-affiliate-link.com/crypto-course
• 🔒 Hardware Wallet: https://your-affiliate-link.com/hardware-wallet

Use promo code: CRYPTO2024 for 25% off!

Ready to dive into the crypto world? Let's make it happen! 🚀`
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
        Animated.sequence([
            Animated.timing(rocketAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(rocketAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            })
        ]).start();

        // Add user's "I want to:" message with smooth animation
        const userChoice = {
            id: Date.now().toString(),
            type: 'sent',
            content: 'I want to:',
            timestamp: new Date(),
            sender: username,
            hasChoiceButtons: true // Flag to show choice buttons below this message
        };

        setMessages(prev => [...prev, userChoice]);

        // Smooth scroll to bottom
        setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
    };

    const handleChoiceButtonPress = async (button) => {
        // Add user's choice as a sent message
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
            flatListRef.current?.scrollToEnd({ animated: true });
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

    const renderMessage = ({ item, index }) => {
        // Animation for new messages
        const messageSlideAnim = new Animated.Value(50);
        const messageFadeAnim = new Animated.Value(0);

        useEffect(() => {
            Animated.parallel([
                Animated.timing(messageSlideAnim, {
                    toValue: 0,
                    duration: 400,
                    useNativeDriver: true,
                }),
                Animated.timing(messageFadeAnim, {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: true,
                })
            ]).start();
        }, []);

        return (
            <Animated.View 
                style={[
                    styles.messageContainer,
                    item.type === 'sent' ? styles.sentMessage : styles.receivedMessage,
                    {
                        transform: [{ translateY: messageSlideAnim }],
                        opacity: messageFadeAnim,
                    }
                ]}
            >
                <View style={[
                    styles.messageBubble,
                    item.type === 'sent' ? styles.sentBubble : styles.receivedBubble
                ]}>
                    <Text style={[
                        styles.messageText,
                        item.type === 'sent' ? styles.sentText : styles.receivedText
                    ]}>
                        {item.content}
                    </Text>
                    <Text style={styles.timestamp}>
                        {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                    
                    {/* Welcome message buttons */}
                    {item.hasButtons && (
                        <View style={styles.welcomeButtonsContainer}>
                            <TouchableOpacity
                                style={styles.welcomeButton}
                                onPress={handleWelcomeButtonPress}
                                activeOpacity={0.8}
                            >
                                <Animated.Text 
                                    style={[
                                        styles.welcomeButtonText,
                                        {
                                            transform: [{
                                                scale: rocketAnim.interpolate({
                                                    inputRange: [0, 1],
                                                    outputRange: [1, 1.2]
                                                })
                                            }]
                                        }
                                    ]}
                                >
                                    🚀 Get Started
                                </Animated.Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* Choice buttons for "I want to:" message */}
                    {item.hasChoiceButtons && (
                        <View style={styles.choiceButtonsContainer}>
                            <TouchableOpacity
                                style={[styles.choiceButton, { backgroundColor: '#667eea' }]}
                                onPress={() => handleChoiceButtonPress({ id: 'dropshipping' })}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.choiceButtonIcon}>🛍️</Text>
                                <View style={styles.choiceButtonContent}>
                                    <Text style={styles.choiceButtonText}>🛍️ Dropshipping!</Text>
                                    <Text style={styles.choiceButtonDescription}>Learn how to start your own online store</Text>
                                </View>
                            </TouchableOpacity>
                            
                            <TouchableOpacity
                                style={[styles.choiceButton, { backgroundColor: '#764ba2' }]}
                                onPress={() => handleChoiceButtonPress({ id: 'sports' })}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.choiceButtonIcon}>🏆</Text>
                                <View style={styles.choiceButtonContent}>
                                    <Text style={styles.choiceButtonText}>🏆 Sports!</Text>
                                    <Text style={styles.choiceButtonDescription}>Master sports betting and analysis</Text>
                                </View>
                            </TouchableOpacity>
                            
                            <TouchableOpacity
                                style={[styles.choiceButton, { backgroundColor: '#f093fb' }]}
                                onPress={() => handleChoiceButtonPress({ id: 'crypto' })}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.choiceButtonIcon}>💰</Text>
                                <View style={styles.choiceButtonContent}>
                                    <Text style={styles.choiceButtonText}>💰 Crypto!</Text>
                                    <Text style={styles.choiceButtonDescription}>Dive into cryptocurrency trading</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </Animated.View>
        );
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#667eea" />
                <Text style={styles.loadingText}>Loading chat...</Text>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView 
            style={styles.container} 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerInfo}>
                    <Text style={styles.headerTitle}>Whop Owner</Text>
                    <Text style={styles.headerSubtitle}>
                        {isConnected ? '🟢 Online' : '🔴 Offline'}
                    </Text>
                </View>
            </View>

            {/* Messages */}
            <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={renderMessage}
                keyExtractor={item => item.id}
                style={styles.messagesList}
                contentContainerStyle={styles.messagesContent}
                showsVerticalScrollIndicator={false}
            />

            {/* Input */}
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.textInput}
                    value={inputText}
                    onChangeText={setInputText}
                    placeholder="Type a message..."
                    placeholderTextColor="#999"
                    multiline
                    maxLength={1000}
                />
                <TouchableOpacity 
                    style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
                    onPress={sendMessage}
                    disabled={!inputText.trim()}
                >
                    <Text style={styles.sendButtonText}>Send</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#666',
    },
    header: {
        backgroundColor: 'white',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerInfo: {
        flex: 1,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1a1a1a',
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#666',
        marginTop: 2,
    },
    messagesList: {
        flex: 1,
    },
    messagesContent: {
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    messageContainer: {
        marginVertical: 5,
        flexDirection: 'row',
    },
    sentMessage: {
        justifyContent: 'flex-end',
    },
    receivedMessage: {
        justifyContent: 'flex-start',
    },
    messageBubble: {
        maxWidth: '80%',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 20,
    },
    sentBubble: {
        backgroundColor: 'rgba(102, 126, 234, 0.9)', // More transparent
        borderBottomRightRadius: 5,
    },
    receivedBubble: {
        backgroundColor: 'white',
        borderBottomLeftRadius: 5,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    messageText: {
        fontSize: 16,
        lineHeight: 22,
    },
    sentText: {
        color: 'white',
    },
    receivedText: {
        color: '#1a1a1a',
    },
    timestamp: {
        fontSize: 12,
        color: '#999',
        marginTop: 5,
        alignSelf: 'flex-end',
    },
    welcomeButtonsContainer: {
        marginTop: 15,
        alignItems: 'center',
    },
    welcomeButton: {
        backgroundColor: '#667eea',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 25,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    welcomeButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    choiceButtonsContainer: {
        marginTop: 15,
        gap: 12, // Increased gap for larger buttons
    },
    choiceButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16, // Increased padding for larger buttons
        borderRadius: 16, // Increased border radius
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 3,
        minHeight: 60, // Minimum height for larger buttons
    },
    choiceButtonIcon: {
        fontSize: 22, // Larger icon
        marginRight: 12,
    },
    choiceButtonContent: {
        flex: 1,
    },
    choiceButtonText: {
        fontSize: 16, // Larger text
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 3,
    },
    choiceButtonDescription: {
        fontSize: 14, // Larger description
        color: 'rgba(255,255,255,0.9)',
        lineHeight: 16,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: '#e9ecef',
    },
    textInput: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginRight: 10,
        fontSize: 16,
        maxHeight: 100,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    sendButton: {
        backgroundColor: '#667eea',
        borderRadius: 20,
        paddingHorizontal: 20,
        paddingVertical: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sendButtonDisabled: {
        backgroundColor: '#ccc',
    },
    sendButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default ChatInterface;
