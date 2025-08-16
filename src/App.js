import React, { useState, useEffect } from 'react';
import { View, StyleSheet, StatusBar, SafeAreaView } from 'react-native';
import ChatInterfaceWeb from './components/ChatInterfaceWeb';

const App = () => {
    const [userId, setUserId] = useState('user_L8YwhuixVcRCf'); // Default test user
    const [username, setUsername] = useState('TestUser');

    useEffect(() => {
        // In a real app, you would get these from Whop's authentication
        // For now, we'll use test values
        console.log('🚀 App initialized with:', { userId, username });
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
            
            {/* Main Chat Interface */}
            <ChatInterfaceWeb
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
