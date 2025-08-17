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
import config, { getApiUrl } from '../config/environment';

const { width, height } = Dimensions.get('window');

const ChatInterface = ({ userId, username = 'User' }) => {
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    // Animation values
    const slideAnim = new Animated.Value(-width);
    const fadeAnim = new Animated.Value(0);
    const scaleAnim = new Animated.Value(0.8);
    const rocketAnim = new Animated.Value(0);
    const goldShimmerAnim = new Animated.Value(0);
    const buttonSwirlAnim1 = new Animated.Value(0);
    const buttonSwirlAnim2 = new Animated.Value(0);
    const buttonSwirlAnim3 = new Animated.Value(0);
    
    const flatListRef = useRef(null);
    const wsRef = useRef(null);
    const reconnectTimeoutRef = useRef(null);

    useEffect(() => {
        if (!userId) {
            console.warn('⚠️ No userId provided to ChatInterface');
            return;
        }

        // Initialize all animations first
        const initializeAnimations = async () => {
            try {
                console.log('🎬 Initializing animations...');
                
                // Start gold shimmer animation
                startGoldShimmer();
                
                // Small delay to ensure animations are ready
                await new Promise(resolve => setTimeout(resolve, 100));
                
                // Initialize chat with welcome message
                initializeChat();
                
                // Connect to WebSocket
                connectWebSocket();
            } catch (error) {
                console.error('❌ Error initializing animations:', error);
                // Fallback: just initialize chat without animations
                initializeChat();
                connectWebSocket();
            }
        };

        initializeAnimations();
        
        return () => {
            if (wsRef.current) {
                wsRef.current.close();
            }
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
        };
    }, []); // Remove userId dependency to prevent infinite re-renders

    const startGoldShimmer = () => {
        try {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(goldShimmerAnim, {
                        toValue: 1,
                        duration: config.GOLD_SHIMMER_DURATION,
                        useNativeDriver: false,
                    }),
                    Animated.timing(goldShimmerAnim, {
                        toValue: 0,
                        duration: config.GOLD_SHIMMER_DURATION,
                        useNativeDriver: false,
                    })
                ])
            ).start();
        } catch (error) {
            console.error('❌ Error starting gold shimmer animation:', error);
        }
    };

    const startButtonSwirlSequence = () => {
        try {
            // Start swirling animation sequence for buttons
            setTimeout(() => {
                Animated.timing(buttonSwirlAnim1, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: false,
                }).start();
            }, 200);

            setTimeout(() => {
                Animated.timing(buttonSwirlAnim2, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: false,
                }).start();
            }, 600);

            setTimeout(() => {
                Animated.timing(buttonSwirlAnim3, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: false,
                }).start();
            }, 1000);

            // Reset animations after sequence
            setTimeout(() => {
                buttonSwirlAnim1.setValue(0);
                buttonSwirlAnim2.setValue(0);
                buttonSwirlAnim3.setValue(0);
            }, 2000);
        } catch (error) {
            console.error('❌ Error starting button swirl sequence:', error);
        }
    };

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
        
        // Auto-scroll to the affiliate response
        setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
    };

    const handleWelcomeButtonPress = () => {
        // Enhanced rocket launch animation
        Animated.sequence([
            // Scale up with bounce
            Animated.timing(rocketAnim, {
                toValue: 1,
                duration: config.ROCKET_ANIMATION_DURATION,
                useNativeDriver: true,
            }),
            // Scale down
            Animated.timing(rocketAnim, {
                toValue: 0.8,
                duration: config.ROCKET_ANIMATION_DURATION * 0.75,
                useNativeDriver: true,
            }),
            // Final scale
            Animated.timing(rocketAnim, {
                toValue: 0,
                duration: config.ROCKET_ANIMATION_DURATION * 0.5,
                useNativeDriver: true,
            })
        ]).start();

        // Add a message with choice buttons
        const choiceMessage = {
            id: Date.now().toString(),
            type: 'sent',
            content: 'I want to get started!',
            timestamp: new Date(),
            sender: username,
            hasChoiceButtons: true // New flag for choice buttons
        };

        setMessages(prev => [...prev, choiceMessage]);

        // Scroll to bottom
        setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);

        // Start button swirl sequence after a short delay
        setTimeout(() => {
            startButtonSwirlSequence();
        }, 300);
    };

    const handleChoiceButtonPress = async (button) => {
        // Add user's choice as a message
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
            const apiUrl = getApiUrl('/api/button-response');
            const response = await fetch(apiUrl, {
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

    const renderMessage = ({ item }) => {
        // Check if message contains links for gold shimmer effect
        const hasLinks = item.content && item.content.includes('https://');
        
        return (
            <View style={[
                styles.messageContainer,
                item.type === 'sent' ? styles.sentMessage : styles.receivedMessage
            ]}>
                <View style={[
                    styles.messageBubble,
                    item.type === 'sent' ? styles.sentBubble : styles.receivedBubble
                ]}>
                    {hasLinks ? (
                        <Animated.View style={[
                            styles.messageContent,
                            {
                                borderWidth: 2,
                                borderColor: goldShimmerAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: ['rgba(255, 215, 0, 0.3)', 'rgba(255, 215, 0, 0.8)']
                                }),
                                borderRadius: 12,
                                padding: 8,
                                backgroundColor: goldShimmerAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: ['rgba(255, 215, 0, 0.05)', 'rgba(255, 215, 0, 0.15)']
                                })
                            }
                        ]}>
                            <Text style={[
                                styles.messageText,
                                item.type === 'sent' ? styles.sentText : styles.receivedText
                            ]}>
                                {item.content}
                            </Text>
                        </Animated.View>
                    ) : (
                        <Text style={[
                            styles.messageText,
                            item.type === 'sent' ? styles.sentText : styles.receivedText
                        ]}>
                            {item.content}
                        </Text>
                    )}
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
                                                    inputRange: [0, 0.8, 1],
                                                    outputRange: [1, 1.3, 1.1]
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

                    {/* Choice buttons for messages with hasChoiceButtons */}
                    {item.hasChoiceButtons && (
                        <View style={styles.choiceButtonsContainer}>
                            <Animated.View style={[
                                styles.choiceButtonWrapper,
                                {
                                    borderWidth: 2,
                                    borderColor: buttonSwirlAnim1.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: ['#667eea', '#667eea']
                                    }),
                                    borderRadius: 12,
                                    shadowColor: buttonSwirlAnim1.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: ['#667eea', '#667eea']
                                    }),
                                    shadowOpacity: buttonSwirlAnim1.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [0.1, 0.8]
                                    }),
                                    shadowRadius: buttonSwirlAnim1.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [4, 12]
                                    }),
                                    elevation: buttonSwirlAnim1.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [2, 8]
                                    }),
                                }
                            ]}>
                                <TouchableOpacity
                                    style={[styles.choiceButton, { borderColor: 'transparent' }]}
                                    onPress={() => handleChoiceButtonPress({ id: 'dropshipping' })}
                                    activeOpacity={0.8}
                                >
                                    <Text style={styles.choiceButtonIcon}>🛍️</Text>
                                    <Text style={styles.choiceButtonText}>Dropshipping</Text>
                                </TouchableOpacity>
                            </Animated.View>
                            
                            <Animated.View style={[
                                styles.choiceButtonWrapper,
                                {
                                    borderWidth: 2,
                                    borderColor: buttonSwirlAnim2.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: ['#764ba2', '#764ba2']
                                    }),
                                    borderRadius: 12,
                                    shadowColor: buttonSwirlAnim2.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: ['#764ba2', '#764ba2']
                                    }),
                                    shadowOpacity: buttonSwirlAnim2.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [0.1, 0.8]
                                    }),
                                    shadowRadius: buttonSwirlAnim2.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [4, 12]
                                    }),
                                    elevation: buttonSwirlAnim2.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [2, 8]
                                    }),
                                }
                            ]}>
                                <TouchableOpacity
                                    style={[styles.choiceButton, { borderColor: 'transparent' }]}
                                    onPress={() => handleChoiceButtonPress({ id: 'sports' })}
                                    activeOpacity={0.8}
                                >
                                    <Text style={styles.choiceButtonIcon}>🏆</Text>
                                    <Text style={styles.choiceButtonText}>Sports</Text>
                                </TouchableOpacity>
                            </Animated.View>
                            
                            <Animated.View style={[
                                styles.choiceButtonWrapper,
                                {
                                    borderWidth: 2,
                                    borderColor: buttonSwirlAnim3.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: ['#f093fb', '#f093fb']
                                    }),
                                    borderRadius: 12,
                                    shadowColor: buttonSwirlAnim3.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: ['#f093fb', '#f093fb']
                                    }),
                                    shadowOpacity: buttonSwirlAnim3.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [0.1, 0.8]
                                    }),
                                    shadowRadius: buttonSwirlAnim3.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [4, 12]
                                    }),
                                    elevation: buttonSwirlAnim3.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [2, 8]
                                    }),
                                }
                            ]}>
                                <TouchableOpacity
                                    style={[styles.choiceButton, { borderColor: 'transparent' }]}
                                    onPress={() => handleChoiceButtonPress({ id: 'crypto' })}
                                    activeOpacity={0.8}
                                >
                                    <Text style={styles.choiceButtonIcon}>💰</Text>
                                    <Text style={styles.choiceButtonText}>Crypto</Text>
                                </TouchableOpacity>
                            </Animated.View>
                        </View>
                    )}
                </View>
            </View>
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
                    maxLength={config.MAX_MESSAGE_LENGTH}
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
        maxWidth: config.CHAT_BUBBLE_MAX_WIDTH,
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
    messageContent: {
        // Container for messages with gold shimmer effect
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
    choiceButtonsOverlay: {
        position: 'absolute',
        bottom: 80,
        left: 20,
        right: 20,
        zIndex: 1000,
    },
    choiceButtonsContainer: {
        flexDirection: 'column',
        marginTop: 10,
        gap: 8,
    },
    choiceButtonWrapper: {
        // Container for animated border and shadow effects
    },
    choiceButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 12,
        backgroundColor: 'white',
        borderWidth: 0, // Border moved to wrapper
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        minHeight: 50,
        justifyContent: 'flex-start',
    },
    choiceButtonIcon: {
        fontSize: 20,
        marginRight: 12,
    },
    choiceButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1a1a1a',
        textAlign: 'center',
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
