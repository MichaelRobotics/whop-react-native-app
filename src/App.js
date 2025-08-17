import React, { useState, useEffect } from 'react';
import { View, StyleSheet, StatusBar, SafeAreaView, Text } from 'react-native';
import ChatInterface from './components/ChatInterface';
import WhopWebSocketClient from './components/WhopWebSocketClient';

const App = () => {
    const [userId, setUserId] = useState('user_L8YwhuixVcRCf'); // Default test user
    const [username, setUsername] = useState('TestUser');
    const [appId, setAppId] = useState(process.env.NEXT_PUBLIC_WHOP_APP_ID || 'app_FInBMCJGyVdD9T');
    const [isWebSocketConnected, setIsWebSocketConnected] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // Start as false to show chat immediately

    // Try to get Whop SDK instance (optional)
    let whopSdk = null;
    try {
        const { useWhopSdk } = require('@whop/react-native');
        whopSdk = useWhopSdk();
    } catch (error) {
        console.log('⚠️ Whop SDK not available, using fallback mode');
    }

    useEffect(() => {
        // Initialize user data from Whop SDK if available
        const initializeUser = async () => {
            try {
                if (whopSdk) {
                    // Get current user information
                    const user = await whopSdk.getCurrentUser();
                    if (user) {
                        setUserId(user.id);
                        setUsername(user.username || user.displayName || 'User');
                        console.log('✅ User authenticated:', { id: user.id, username: user.username });
                    } else {
                        console.log('⚠️ No user found, using fallback values');
                        setUserId('user_L8YwhuixVcRCf');
                        setUsername('TestUser');
                    }
                } else {
                    console.log('⚠️ Whop SDK not available, using fallback values');
                    setUserId('user_L8YwhuixVcRCf');
                    setUsername('TestUser');
                }
                setIsLoading(false);
            } catch (error) {
                console.error('❌ Error initializing user:', error);
                // Fallback values for development
                setUserId('user_L8YwhuixVcRCf');
                setUsername('TestUser');
                setIsLoading(false);
            }
        };

        initializeUser();
    }, [whopSdk]);

    const handleWebSocketMessage = (message) => {
        console.log('📨 WebSocket message received in App:', message);
        // The ChatInterface will handle the message display
    };

    const handleWebSocketConnectionChange = (connected) => {
        setIsWebSocketConnected(connected);
        console.log('🔌 WebSocket connection changed:', connected);
    };

    if (isLoading) {
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
                <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>Loading...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
            
            {/* WebSocket Status Indicator */}
            <WhopWebSocketClient
                userId={userId}
                appId={appId}
                onMessage={handleWebSocketMessage}
                onConnectionChange={handleWebSocketConnectionChange}
            />
            
            {/* Main Chat Interface */}
            <ChatInterface
                userId={userId}
                username={username}
            />
        </SafeAreaView>
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
});

export default App;
