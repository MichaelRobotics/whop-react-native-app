// Environment configuration for the Whop React Native app
const config = {
    // Whop App Configuration
    WHOP_APP_ID: process.env.NEXT_PUBLIC_WHOP_APP_ID || 'app_FInBMCJGyVdD9T',
    WHOP_API_KEY: process.env.WHOP_API_KEY,
    WHOP_PERSONAL_USER_ID: process.env.WHOP_PERSONAL_USER_ID,
    WHOP_AGENT_USER_ID: process.env.NEXT_PUBLIC_WHOP_AGENT_USER_ID,
    WHOP_WEBHOOK_SECRET: process.env.WHOP_WEBHOOK_SECRET,

    // API Endpoints
    API_BASE_URL: process.env.NODE_ENV === 'production' 
        ? 'https://whop-react-native-app.vercel.app'
        : 'http://localhost:3000',

    // Environment
    NODE_ENV: process.env.NODE_ENV || 'development',
    IS_PRODUCTION: process.env.NODE_ENV === 'production',
    IS_DEVELOPMENT: process.env.NODE_ENV === 'development',

    // WebSocket Configuration
    WEBSOCKET_RECONNECT_INTERVAL: 5000,
    WEBSOCKET_HEARTBEAT_INTERVAL: 30000,

    // Chat Configuration
    MAX_MESSAGE_LENGTH: 1000,
    MESSAGE_ANIMATION_DURATION: 500,
    GOLD_SHIMMER_DURATION: 1500,

    // UI Configuration
    CHAT_BUBBLE_MAX_WIDTH: '80%',
    CHOICE_BUTTONS_ANIMATION_DURATION: 500,
    ROCKET_ANIMATION_DURATION: 300,

    // Fallback Values (for development)
    FALLBACK_USER_ID: 'user_L8YwhuixVcRCf',
    FALLBACK_USERNAME: 'TestUser',
};

// Validate required environment variables
const validateConfig = () => {
    const required = [
        'WHOP_APP_ID',
        'WHOP_API_KEY',
        'WHOP_AGENT_USER_ID'
    ];

    const missing = required.filter(key => !config[key]);
    
    if (missing.length > 0) {
        console.warn('⚠️ Missing environment variables:', missing);
        console.warn('📝 Please check your .env file or environment configuration');
    }

    return missing.length === 0;
};

// Export configuration and validation
export default config;
export { validateConfig };

// Helper functions
export const getApiUrl = (endpoint) => {
    return `${config.API_BASE_URL}${endpoint}`;
};

export const isWhopEnvironment = () => {
    return typeof window !== 'undefined' && window.self !== window.top;
};

export const getWhopUserInfo = () => {
    if (typeof window !== 'undefined') {
        // Try to get user info from Whop iframe context
        try {
            return window.whop?.user || null;
        } catch (error) {
            console.warn('Could not get Whop user info:', error);
            return null;
        }
    }
    return null;
};
