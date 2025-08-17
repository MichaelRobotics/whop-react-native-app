import React, { useState, useEffect } from 'react';
import { View, StyleSheet, StatusBar, SafeAreaView, Text } from 'react-native';
import { useWhopSdk } from '@whop/react-native';
import ChatInterface from './components/ChatInterface';
import WhopWebSocketClient from './components/WhopWebSocketClient';

const App = () => {
    const [userId, setUserId] = useState(null);
    const [username, setUsername] = useState(null);
    const [appId, setAppId] = useState(process.env.NEXT_PUBLIC_WHOP_APP_ID);
    const [isWebSocketConnected, setIsWebSocketConnected] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Get Whop SDK instance
    const whopSdk = useWhopSdk();

    useEffect(() => {
        // Initialize user data from Whop SDK
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
                        setUserId('user_L8YwhuixVcRCf'); // Fallback for development
                        setUsername('TestUser');
                    }
                } else {
                    console.log('⚠️ Whop SDK not available, using fallback values');
                    setUserId('user_L8YwhuixVcRCf'); // Fallback for development
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
