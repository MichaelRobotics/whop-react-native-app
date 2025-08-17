import { WhopServerSdk } from '@whop/api';

// Server-side SDK for API calls
export const whopServerSdk = WhopServerSdk({
    appApiKey: process.env.WHOP_API_KEY,
    appId: process.env.NEXT_PUBLIC_WHOP_APP_ID,
    onBehalfOfUserId: process.env.WHOP_PERSONAL_USER_ID || process.env.NEXT_PUBLIC_WHOP_AGENT_USER_ID,
});

// Client-side SDK configuration for React Native
export const whopClientConfig = {
    appId: process.env.NEXT_PUBLIC_WHOP_APP_ID,
    apiKey: process.env.NEXT_PUBLIC_WHOP_API_KEY, // Public API key for client
    environment: process.env.NODE_ENV || 'development',
};

// Helper function to get user information
export const getUserInfo = async (userId) => {
    try {
        const user = await whopServerSdk.users.retrieveUser({
            userId: userId,
        });
        return user;
    } catch (error) {
        console.error('Error fetching user info:', error);
        return null;
    }
};

// Helper function to send messages
export const sendMessage = async (userId, message) => {
    try {
        const result = await whopServerSdk.messages.sendDirectMessageToUser({
            toUserIdOrUsername: userId,
            message: message,
        });
        return result;
    } catch (error) {
        console.error('Error sending message:', error);
        throw error;
    }
};

// Helper function to get app information
export const getAppInfo = async () => {
    try {
        const app = await whopServerSdk.apps.retrieveApp({
            appId: process.env.NEXT_PUBLIC_WHOP_APP_ID,
        });
        return app;
    } catch (error) {
        console.error('Error fetching app info:', error);
        return null;
    }
};
