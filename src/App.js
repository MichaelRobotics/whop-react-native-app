import React, { useState, useEffect } from 'react';
import { View, StyleSheet, StatusBar, SafeAreaView, Text, ActivityIndicator, Alert } from 'react-native';
import ChatInterface from './components/ChatInterface';
import WhopWebSocketClient from './components/WhopWebSocketClient';
import ErrorBoundary from './components/ErrorBoundary';
import config, { validateConfig, getWhopUserInfo } from './config/environment';

const App = () => {
    const [userId, setUserId] = useState(config.FALLBACK_USER_ID);
    const [username, setUsername] = useState(config.FALLBACK_USERNAME);
    const [appId, setAppId] = useState(config.WHOP_APP_ID);
    const [isWebSocketConnected, setIsWebSocketConnected] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const initializeApp = async () => {
            try {
                console.log('🚀 App initializing...');
                
                // Validate environment configuration
                const isValidConfig = validateConfig();
                if (!isValidConfig) {
                    console.warn('⚠️ Environment configuration incomplete - using fallback values');
                }
                
                // Try to get user info from Whop environment
                const whopUserInfo = getWhopUserInfo();
                if (whopUserInfo) {
                    setUserId(whopUserInfo.id || config.FALLBACK_USER_ID);
                    setUsername(whopUserInfo.username || whopUserInfo.displayName || config.FALLBACK_USERNAME);
                    console.log('✅ User info from Whop environment:', whopUserInfo);
                } else {
                    console.log('⚠️ No Whop user info available, using fallback values');
                }
                
                console.log('📱 Platform info:', { 
                    userId: userId, 
                    username: username, 
                    appId: appId,
                    isProduction: config.IS_PRODUCTION,
                    timestamp: new Date().toISOString()
                });
                
                // Add a small delay to ensure proper initialization
                await new Promise(resolve => setTimeout(resolve, 500));
                
                console.log('✅ App initialized successfully');
                
                setIsLoading(false);
            } catch (err) {
                console.error('❌ App initialization failed:', err);
                setError(err.message);
                setIsLoading(false);
            }
        };

        initializeApp();
    }, []);

    const handleWebSocketMessage = (message) => {
        console.log('📨 WebSocket message received in App:', message);
        // The ChatInterface will handle the message display
    };

    const handleWebSocketConnectionChange = (connected) => {
        setIsWebSocketConnected(connected);
        console.log('🔌 WebSocket connection changed:', connected);
    };

    // Error state
    if (error) {
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
                <View style={styles.errorContainer}>
                    <Text style={styles.errorTitle}>⚠️ Something went wrong</Text>
                    <Text style={styles.errorText}>{error}</Text>
                    <Text style={styles.errorSubtext}>Please try restarting the app</Text>
                </View>
            </SafeAreaView>
        );
    }

    // Loading state
    if (isLoading) {
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#667eea" />
                    <Text style={styles.loadingText}>Loading chat...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <ErrorBoundary>
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
        </ErrorBoundary>
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
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        padding: 20,
    },
    errorTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#e74c3c',
        marginBottom: 10,
        textAlign: 'center',
    },
    errorText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 10,
    },
    errorSubtext: {
        fontSize: 14,
        color: '#999',
        textAlign: 'center',
    },
});

export default App;
