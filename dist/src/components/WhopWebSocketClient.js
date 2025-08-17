import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useWhopSdk } from '@whop/react-native';

const WhopWebSocketClient = ({ userId, appId, onMessage, onConnectionChange }) => {
    const [isConnected, setIsConnected] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState('disconnected');
    
    const wsRef = useRef(null);
    const reconnectTimeoutRef = useRef(null);
    const heartbeatIntervalRef = useRef(null);

    // Get Whop SDK instance
    const whopSdk = useWhopSdk();

    useEffect(() => {
        if (!userId || !appId) return;

        connectWebSocket();
        
        return () => {
            disconnectWebSocket();
        };
    }, [userId, appId, whopSdk]);

    const connectWebSocket = async () => {
        try {
            console.log('🔌 Connecting to Whop WebSocket...');
            setConnectionStatus('connecting');
            
            if (whopSdk) {
                // Use real Whop WebSocket connection
                const connection = await whopSdk.connectWebSocket({
                    userId: userId,
                    appId: appId,
                    onMessage: (message) => {
                        console.log('📨 Real WebSocket message received:', message);
                        onMessage?.(message);
                    },
                    onConnect: () => {
                        console.log('✅ Real WebSocket connected successfully');
                        setIsConnected(true);
                        setConnectionStatus('connected');
                        onConnectionChange?.(true);
                        startHeartbeat();
                    },
                    onDisconnect: () => {
                        console.log('🔌 Real WebSocket disconnected');
                        setIsConnected(false);
                        setConnectionStatus('disconnected');
                        onConnectionChange?.(false);
                        stopHeartbeat();
                        
                        // Attempt to reconnect
                        reconnectTimeoutRef.current = setTimeout(connectWebSocket, 5000);
                    },
                    onError: (error) => {
                        console.error('❌ Real WebSocket error:', error);
                        setConnectionStatus('error');
                        onConnectionChange?.(false);
                    }
                });
                
                wsRef.current = connection;
            } else {
                // Fallback to simulated connection for development
                console.log('⚠️ Whop SDK not available, using simulated WebSocket');
                setTimeout(() => {
                    setIsConnected(true);
                    setConnectionStatus('connected');
                    onConnectionChange?.(true);
                    
                    console.log('✅ Simulated WebSocket connected successfully');
                    
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
            }
            
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
            if (typeof wsRef.current.close === 'function') {
                wsRef.current.close();
            }
            wsRef.current = null;
        }
        
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
            reconnectTimeoutRef.current = null;
        }
        
        stopHeartbeat();
        
        setIsConnected(false);
        setConnectionStatus('disconnected');
        onConnectionChange?.(false);
    };

    const startHeartbeat = () => {
        // Send heartbeat every 30 seconds to keep connection alive
        heartbeatIntervalRef.current = setInterval(() => {
            if (isConnected && wsRef.current) {
                console.log('💓 WebSocket heartbeat');
                // Send ping message if available
                if (typeof wsRef.current.ping === 'function') {
                    wsRef.current.ping();
                }
            }
        }, 30000);
    };

    const stopHeartbeat = () => {
        if (heartbeatIntervalRef.current) {
            clearInterval(heartbeatIntervalRef.current);
            heartbeatIntervalRef.current = null;
        }
    };

    const sendMessage = (message) => {
        if (!isConnected) {
            console.warn('⚠️ WebSocket not connected, cannot send message');
            return false;
        }
        
        try {
            console.log('📤 Sending WebSocket message:', message);
            
            if (wsRef.current && typeof wsRef.current.send === 'function') {
                wsRef.current.send(message);
                return true;
            } else {
                console.warn('⚠️ WebSocket send method not available');
                return false;
            }
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
