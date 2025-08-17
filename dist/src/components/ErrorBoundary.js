import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // Log the error
        console.error('❌ ErrorBoundary caught an error:', error, errorInfo);
        this.setState({
            error: error,
            errorInfo: errorInfo
        });
    }

    handleRetry = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
    };

    render() {
        if (this.state.hasError) {
            return (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorTitle}>⚠️ Something went wrong</Text>
                    <Text style={styles.errorText}>
                        The app encountered an unexpected error. Please try again.
                    </Text>
                    <TouchableOpacity style={styles.retryButton} onPress={this.handleRetry}>
                        <Text style={styles.retryButtonText}>🔄 Retry</Text>
                    </TouchableOpacity>
                    {__DEV__ && this.state.error && (
                        <Text style={styles.errorDetails}>
                            Error: {this.state.error.toString()}
                        </Text>
                    )}
                </View>
            );
        }

        return this.props.children;
    }
}

const styles = StyleSheet.create({
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
        marginBottom: 20,
        lineHeight: 22,
    },
    retryButton: {
        backgroundColor: '#667eea',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 25,
        marginBottom: 10,
    },
    retryButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    errorDetails: {
        fontSize: 12,
        color: '#999',
        textAlign: 'center',
        marginTop: 10,
        fontFamily: 'monospace',
    },
});

export default ErrorBoundary;
