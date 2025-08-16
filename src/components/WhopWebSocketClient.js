import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const WhopWebSocketClient = ({ userId, appId, onMessage, onConnectionChange }) => {
    const [isConnected, setIsConnected] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState('disconnected');
    
    const wsRef = useRef(null);
    const reconnectTimeoutRef = useRef(null);
    const heartbeatIntervalRef = useRef(null);

    useEffect(() => {
        if (!userId || !appId) return;

        connectWebSocket();
        
        return () => {
            disconnectWebSocket();
        };
    }, [userId, appId]);

    const connectWebSocket = () => {
        try {
            console.log('🔌 Connecting to Whop WebSocket...');
            setConnectionStatus('connecting');
            
            // In a real implementation, you would connect to Whop's WebSocket
            // For now, we'll simulate the connection and messages
            setTimeout(() => {
                setIsConnected(true);
                setConnectionStatus('connected');
                onConnectionChange?.(true);
                
                console.log('✅ WebSocket connected successfully');
                
                // Start heartbeat
                startHeartbeat();
                
                // Simulate receiving interactive button data
                setTimeout(() => {
                    const simulatedMessage = {
                        type: 'interactive_buttons',
                        title: '🚀 Ready to Level Up?',
                        subtitle: 'Choose your path to success:',
                        buttons: [
                            { 
                                id: 'dropshipping', 
                                text: '🛍️ Dropshipping!', 
                                description: 'Learn how to start your own online store', 
                                color: '#667eea', 
                                icon: '🛍️' 
                            },
                            { 
                                id: 'sports', 
                                text: '🏆 Sports!', 
                                description: 'Master sports betting and analysis', 
                                color: '#764ba2', 
                                icon: '🏆' 
                            },
                            { 
                                id: 'crypto', 
                                text: '💰 Crypto!', 
                                description: 'Dive into cryptocurrency trading', 
                                color: '#f093fb', 
                                icon: '💰' 
                            }
                        ],
                        animation: { type: 'slideIn', duration: 500, easing: 'easeOut' },
                        styling: { 
                            backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                            borderRadius: '12px', 
                            padding: '20px', 
                            boxShadow: '0 4px 15px rgba(0,0,0,0.1)' 
                        }
                    };
                    
                    onMessage?.(simulatedMessage);
                }, 2000);
                
            }, 1000);
            
        } catch (error) {
            console.error('❌ WebSocket connection failed:', error);
            setConnectionStatus('error');
            onConnectionChange?.(false);
            
            // Attempt to reconnect
            reconnectTimeoutRef.current = setTimeout(connectWebSocket, 5000);
        }
    };

    const disconnectWebSocket = () => {
        if (wsRef.current) {
            wsRef.current.close();
            wsRef.current = null;
        }
        
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
            reconnectTimeoutRef.current = null;
        }
        
        if (heartbeatIntervalRef.current) {
            clearInterval(heartbeatIntervalRef.current);
            heartbeatIntervalRef.current = null;
        }
        
        setIsConnected(false);
        setConnectionStatus('disconnected');
        onConnectionChange?.(false);
    };

    const startHeartbeat = () => {
        // Send heartbeat every 30 seconds to keep connection alive
        heartbeatIntervalRef.current = setInterval(() => {
            if (isConnected) {
                console.log('💓 WebSocket heartbeat');
                // In real implementation, send ping message
            }
        }, 30000);
    };

    const sendMessage = (message) => {
        if (!isConnected) {
            console.warn('⚠️ WebSocket not connected, cannot send message');
            return false;
        }
        
        try {
            console.log('📤 Sending WebSocket message:', message);
            // In real implementation, send via WebSocket
            return true;
        } catch (error) {
            console.error('❌ Error sending WebSocket message:', error);
            return false;
        }
    };

    // Expose methods for parent component
    useEffect(() => {
        if (onConnectionChange) {
            onConnectionChange(isConnected);
        }
    }, [isConnected, onConnectionChange]);

    return (
        <View style={styles.container}>
            {/* Connection status indicator */}
            <View style={[
                styles.statusIndicator,
                isConnected ? styles.connected : styles.disconnected
            ]}>
                <Text style={styles.statusText}>
                    {isConnected ? '🟢 WebSocket Connected' : '🔴 WebSocket Disconnected'}
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 1000,
    },
    statusIndicator: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    connected: {
        backgroundColor: '#e8f5e8',
        borderWidth: 1,
        borderColor: '#4caf50',
    },
    disconnected: {
        backgroundColor: '#ffebee',
        borderWidth: 1,
        borderColor: '#f44336',
    },
    statusText: {
        fontSize: 10,
        fontWeight: '500',
        color: '#2d5a2d',
    },
});

export default WhopWebSocketClient;
