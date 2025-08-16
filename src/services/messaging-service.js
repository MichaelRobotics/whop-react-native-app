import { WhopSDK } from '@whop/sdk';

// Initialize Whop SDK with your app credentials
// Using the environment variables that are already configured
const whopSdk = new WhopSDK({
    apiKey: process.env.WHOP_API_KEY,
});

/**
 * Send a welcome message to a new user
 * @param {string} userId - The user's ID
 * @param {string} username - The user's username
 * @returns {Promise<boolean>} - Success status
 */
export async function sendWelcomeMessage(userId, username) {
    try {
        const welcomeMessage = `🎉 Welcome to our community, ${username}! 

Thank you for joining us! We're excited to have you on board.

Here's what you can expect:
• Access to exclusive content
• Community discussions
• Regular updates and new features

If you have any questions, feel free to reach out to our support team.

Welcome aboard! 🚀`;

        // Use the correct Whop SDK method for sending direct messages
        const result = await whopSdk.messages.sendDirectMessageToUser({
            toUserIdOrUsername: userId,
            message: welcomeMessage,
        });

        console.log('Message sent successfully:', result);
        return true;
    } catch (error) {
        console.error('Error sending welcome message:', error);
        return false;
    }
}

/**
 * Send a custom message to a user
 * @param {string} userId - The user's ID
 * @param {string} message - The message to send
 * @returns {Promise<boolean>} - Success status
 */
export async function sendCustomMessage(userId, message) {
    try {
        const result = await whopSdk.messages.sendDirectMessageToUser({
            toUserIdOrUsername: userId,
            message: message
        });

        console.log('Custom message sent successfully to:', userId);
        return true;
    } catch (error) {
        console.error('Error sending custom message:', error);
        return false;
    }
}

/**
 * Send a payment confirmation message
 * @param {string} userId - The user's ID
 * @param {string} username - The user's username
 * @param {Object} paymentData - Payment information
 * @returns {Promise<boolean>} - Success status
 */
export async function sendPaymentConfirmation(userId, username, paymentData) {
    try {
        const confirmationMessage = `✅ Payment Confirmed, ${username}!

Your payment has been processed successfully. Thank you for your purchase!

Payment Details:
• Amount: $${paymentData.amount || 'N/A'}
• Date: ${new Date().toLocaleDateString()}
• Status: Confirmed

You now have full access to all our exclusive content and features.

Enjoy your membership! 🎉`;

        const result = await whopSdk.messages.sendDirectMessageToUser({
            toUserIdOrUsername: userId,
            message: confirmationMessage,
        });

        console.log('Payment confirmation sent successfully:', result);
        return true;
    } catch (error) {
        console.error('Error sending payment confirmation:', error);
        return false;
    }
}

export default {
    sendWelcomeMessage,
    sendCustomMessage,
    sendPaymentConfirmation
};
