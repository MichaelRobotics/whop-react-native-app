import React, { useState, useEffect } from 'react';
import { View, StyleSheet, StatusBar, SafeAreaView } from 'react-native';
import ChatInterface from './components/ChatInterface';
import WhopWebSocketClient from './components/WhopWebSocketClient';

const App = () => {
    const [userId, setUserId] = useState('user_L8YwhuixVcRCf'); // Default test user
    const [username, setUsername] = useState('TestUser');
    const [appId, setAppId] = useState('your_app_id_here');
    const [isWebSocketConnected, setIsWebSocketConnected] = useState(false);

    useEffect(() => {
        // In a real app, you would get these from Whop's authentication
        // For now, we'll use test values
        console.log('🚀 App initialized with:', { userId, username, appId });
    }, []);

    const handleWebSocketMessage = (message) => {
        console.log('📨 WebSocket message received in App:', message);
        // The ChatInterface will handle the message display
    };

    const handleWebSocketConnectionChange = (connected) => {
        setIsWebSocketConnected(connected);
        console.log('🔌 WebSocket connection changed:', connected);
    };

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
});

export default App;
