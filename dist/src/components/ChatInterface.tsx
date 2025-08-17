import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    Animated,
    Linking,
    Alert,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { useWhopSdk } from '@whop/react-native';

interface ChatInterfaceProps {
    userId: string;
    username?: string;
}

interface Message {
    id: string;
    type: 'sent' | 'received';
    content: string;
    timestamp: Date;
    sender: string;
    hasButtons?: boolean;
}

interface ChoiceButton {
    id: string;
    text: string;
    description: string;
    color: string;
    icon: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ userId, username = 'User' }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [showChoiceButtons, setShowChoiceButtons] = useState(false);
    const [rocketAnim] = useState(new Animated.Value(0));
    const [choiceContainerAnim] = useState(new Animated.Value(0));
    const [goldShimmerAnim] = useState(new Animated.Value(0));
    
    const flatListRef = useRef<FlatList<Message>>(null);
    const inputRef = useRef<TextInput>(null);

    // Get Whop SDK instance
    const whopSdk = useWhopSdk();

    useEffect(() => {
        if (!userId) return;

        // Initialize chat with welcome message
        initializeChat();
        
        // Start gold shimmer animation for links
        startGoldShimmer();
    }, [userId]);

    const initializeChat = () => {
        const welcomeMessage: Message = {
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

    const startGoldShimmer = () => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(goldShimmerAnim, {
                    toValue: 1,
                    duration: 1500,
                    useNativeDriver: false,
                }),
                Animated.timing(goldShimmerAnim, {
                    toValue: 0,
                    duration: 1500,
                    useNativeDriver: false,
                })
            ])
        ).start();
    };

    const sendMessage = async () => {
        if (!inputText.trim()) return;

        const newMessage: Message = {
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

        // Send message via Whop SDK if available
        if (whopSdk) {
            try {
                await whopSdk.sendMessage({
                    content: inputText,
                    userId: userId,
                    type: 'direct_message'
                });
                console.log('✅ Message sent via Whop SDK');
            } catch (error) {
                console.error('❌ Error sending message via Whop SDK:', error);
            }
        }

        // Simulate response based on message content
        setTimeout(() => {
            handleUserMessage(inputText);
        }, 1000);
    };

    const handleUserMessage = (content: string) => {
        const lowerContent = content.toLowerCase();
        
        if (lowerContent.includes('dropshipping')) {
            sendAutomatedResponse('dropshipping');
        } else if (lowerContent.includes('sports')) {
            sendAutomatedResponse('sports');
        } else if (lowerContent.includes('crypto')) {
            sendAutomatedResponse('crypto');
        } else {
            // Default response
            const defaultResponse: Message = {
                id: Date.now().toString(),
                type: 'received',
                content: `Thanks! Reply with "dropshipping", "sports", or "crypto" to get started! 🚀`,
                timestamp: new Date(),
                sender: 'Whop Owner'
            };
            setMessages(prev => [...prev, defaultResponse]);
        }
    };

    const sendAutomatedResponse = (option: string) => {
        const responses: Record<string, string> = {
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

        const response: Message = {
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

        // Show choice buttons with animation
        setTimeout(() => {
            setShowChoiceButtons(true);
            Animated.timing(choiceContainerAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }).start();
        }, 300);

        // Scroll to bottom
        setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
    };

    const handleChoiceButtonPress = async (button: ChoiceButton) => {
        // Hide choice buttons with animation
        Animated.timing(choiceContainerAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            setShowChoiceButtons(false);
        });

        // Add user's choice as a single message
        const userChoice: Message = {
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

    const sendChoiceToServer = async (button: ChoiceButton) => {
        try {
            // Use Vercel API endpoint
            const apiUrl = process.env.NODE_ENV === 'production' 
                ? 'https://whop-react-native-app.vercel.app/api/button-response'
                : 'http://localhost:3000/api/button-response';

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

    const handleLinkPress = async (url: string) => {
        try {
            const supported = await Linking.canOpenURL(url);
            if (supported) {
                await Linking.openURL(url);
            } else {
                Alert.alert('Error', 'Cannot open this link');
            }
        } catch (error) {
            console.error('❌ Error opening link:', error);
            Alert.alert('Error', 'Failed to open link');
        }
    };

    const renderMessageContent = (content: string) => {
        // Split content by URLs and render each part
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const parts = content.split(urlRegex);
        
        return parts.map((part, index) => {
            if (urlRegex.test(part)) {
                const shimmerInterpolation = goldShimmerAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [
                        'rgba(255, 215, 0, 0.6)',
                        'rgba(255, 215, 0, 1)'
                    ]
                });

                const bgInterpolation = goldShimmerAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [
                        'rgba(255, 215, 0, 0.1)',
                        'rgba(255, 215, 0, 0.2)'
                    ]
                });

                const shadowInterpolation = goldShimmerAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.3, 0.6]
                });

                return (
                    <Animated.View
                        key={index}
                        style={[
                            styles.goldLinkContainer,
                            {
                                borderColor: shimmerInterpolation,
                                backgroundColor: bgInterpolation,
                                shadowOpacity: shadowInterpolation,
                            }
                        ]}
                    >
                        <TouchableOpacity
                            style={styles.goldLinkButton}
                            onPress={() => handleLinkPress(part)}
                        >
                            <Text style={styles.goldLinkText}>{part}</Text>
                        </TouchableOpacity>
                    </Animated.View>
                );
            } else {
                return (
                    <Text key={index} style={styles.messageText}>
                        {part}
                    </Text>
                );
            }
        });
    };

    const renderMessage = ({ item: message }: { item: Message }) => {
        const isSent = message.type === 'sent';
        
        return (
            <View style={[
                styles.messageContainer,
                isSent ? styles.sentMessage : styles.receivedMessage
            ]}>
                <View style={[
                    styles.messageBubble,
                    isSent ? styles.sentBubble : styles.receivedBubble
                ]}>
                    <View style={styles.messageContent}>
                        {renderMessageContent(message.content)}
                    </View>
                    <Text style={styles.timestamp}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                    
                    {/* Welcome message buttons */}
                    {message.hasButtons && (
                        <View style={styles.welcomeButtonsContainer}>
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
                                <TouchableOpacity
                                    style={styles.welcomeButton}
                                    onPress={handleWelcomeButtonPress}
                                >
                                    🚀 Get Started
                                </TouchableOpacity>
                            </Animated.Text>
                        </View>
                    )}
                </View>
            </View>
        );
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Loading chat...</Text>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView 
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            {/* Messages */}
            <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={renderMessage}
                keyExtractor={(item) => item.id}
                style={styles.messagesList}
                showsVerticalScrollIndicator={false}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            />

            {/* Choice Buttons Container - Separate from messages */}
            {showChoiceButtons && (
                <Animated.View 
                    style={[
                        styles.choiceButtonsOverlay,
                        {
                            opacity: choiceContainerAnim,
                            transform: [{
                                translateY: choiceContainerAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [50, 0]
                                })
                            }]
                        }
                    ]}
                >
                    <View style={styles.choiceButtonsContainer}>
                        <TouchableOpacity
                            style={[styles.choiceButton, { borderColor: '#667eea' }]}
                            onPress={() => handleChoiceButtonPress({ id: 'dropshipping', text: '🛍️ Dropshipping!', description: 'Learn how to start your own online store', color: '#667eea', icon: '🛍️' })}
                        >
                            <Text style={styles.choiceButtonIcon}>🛍️</Text>
                            <View style={styles.choiceButtonContent}>
                                <Text style={styles.choiceButtonText}>🛍️ Dropshipping!</Text>
                                <Text style={styles.choiceButtonDescription}>Learn how to start your own online store</Text>
                            </View>
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                            style={[styles.choiceButton, { borderColor: '#764ba2' }]}
                            onPress={() => handleChoiceButtonPress({ id: 'sports', text: '🏆 Sports!', description: 'Master sports betting and analysis', color: '#764ba2', icon: '🏆' })}
                        >
                            <Text style={styles.choiceButtonIcon}>🏆</Text>
                            <View style={styles.choiceButtonContent}>
                                <Text style={styles.choiceButtonText}>🏆 Sports!</Text>
                                <Text style={styles.choiceButtonDescription}>Master sports betting and analysis</Text>
                            </View>
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                            style={[styles.choiceButton, { borderColor: '#f093fb' }]}
                            onPress={() => handleChoiceButtonPress({ id: 'crypto', text: '💰 Crypto!', description: 'Dive into cryptocurrency trading', color: '#f093fb', icon: '💰' })}
                        >
                            <Text style={styles.choiceButtonIcon}>💰</Text>
                            <View style={styles.choiceButtonContent}>
                                <Text style={styles.choiceButtonText}>💰 Crypto!</Text>
                                <Text style={styles.choiceButtonDescription}>Dive into cryptocurrency trading</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            )}

            {/* Input */}
            <View style={styles.inputContainer}>
                <TextInput
                    ref={inputRef}
                    style={styles.textInput}
                    value={inputText}
                    onChangeText={setInputText}
                    placeholder="Type a message..."
                    multiline
                    maxLength={1000}
                    onSubmitEditing={sendMessage}
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
    },
    loadingText: {
        fontSize: 16,
        color: '#666',
    },
    messagesList: {
        flex: 1,
        padding: 15,
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
        padding: 12,
        borderRadius: 18,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    sentBubble: {
        backgroundColor: 'rgba(102, 126, 234, 0.9)',
        borderBottomRightRadius: 4,
    },
    receivedBubble: {
        backgroundColor: 'white',
        borderBottomLeftRadius: 4,
    },
    messageContent: {
        marginBottom: 4,
    },
    messageText: {
        fontSize: 16,
        color: '#1a1a1a',
        lineHeight: 22,
    },
    timestamp: {
        fontSize: 12,
        color: '#999',
        alignSelf: 'flex-end',
        marginTop: 2,
    },
    welcomeButtonsContainer: {
        marginTop: 10,
        alignItems: 'center',
    },
    welcomeButton: {
        backgroundColor: '#667eea',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    welcomeButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    choiceButtonsOverlay: {
        position: 'absolute',
        bottom: 80,
        left: 15,
        right: 15,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: 16,
        padding: 15,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 8,
    },
    choiceButtonsContainer: {
        gap: 12,
    },
    choiceButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        backgroundColor: 'white',
        borderWidth: 2,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        minHeight: 70,
    },
    choiceButtonIcon: {
        fontSize: 24,
        marginRight: 12,
    },
    choiceButtonContent: {
        flex: 1,
    },
    choiceButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1a1a1a',
        marginBottom: 4,
    },
    choiceButtonDescription: {
        fontSize: 14,
        color: '#666',
        lineHeight: 18,
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 15,
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: '#e9ecef',
        alignItems: 'flex-end',
    },
    textInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#e9ecef',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginRight: 10,
        maxHeight: 100,
        fontSize: 16,
    },
    sendButton: {
        backgroundColor: '#667eea',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 20,
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
    goldLinkContainer: {
        marginVertical: 4,
        borderRadius: 8,
        borderWidth: 2,
        shadowColor: '#FFD700',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowRadius: 4,
        elevation: 3,
    },
    goldLinkButton: {
        padding: 8,
        borderRadius: 6,
    },
    goldLinkText: {
        fontSize: 14,
        color: '#1a1a1a',
        textDecorationLine: 'underline',
        fontWeight: '500',
    },
});

export default ChatInterface;
