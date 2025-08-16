const crypto = require('crypto');

// Webhook secret for authentication
const WEBHOOK_SECRET = process.env.WHOP_WEBHOOK_SECRET || 'ws_ca76a75da35c7f8271455638e8fea03b8acd42ef00ceab9b4fc037f3bb284fa7';

// Function to verify webhook signature
function verifyWebhookSignature(payload, signature) {
    if (!WEBHOOK_SECRET) {
        console.warn('No webhook secret configured, skipping signature verification');
        return true;
    }
    
    const expectedSignature = crypto
        .createHmac('sha256', WEBHOOK_SECRET)
        .update(payload, 'utf8')
        .digest('hex');
    
    return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature)
    );
}

// Handle payment succeeded events
async function handlePaymentSucceeded(data) {
    try {
        const userId = data.user?.id || data.userId;
        const username = data.user?.username || data.username || 'New Member';
        const amount = data.amount || data.payment?.amount;
        
        if (!userId) {
            console.error('No user ID found in payment data:', data);
            return;
        }
        
        console.log(`✅ Payment succeeded for user: ${userId} (${username}) - Amount: $${amount}`);
        
        // Payment confirmation message (would be sent via Whop SDK)
        const confirmationMessage = `✅ Payment Confirmed, ${username}!

Your payment has been processed successfully. Thank you for your purchase!

Payment Details:
• Amount: $${amount || 'N/A'}
• Date: ${new Date().toLocaleDateString()}
• Status: Confirmed

You now have full access to all our exclusive content and features.

Enjoy your membership! 🎉`;

        console.log(`📧 WOULD SEND PAYMENT CONFIRMATION TO ${username}:`);
        console.log(`   User ID: ${userId}`);
        console.log(`   Message: ${confirmationMessage}`);
        
        // TODO: Uncomment when @whop/api is properly configured
        // await whopSdk.messages.sendDirectMessageToUser({
        //     toUserIdOrUsername: userId,
        //     message: confirmationMessage,
        // });
        
        return true;
    } catch (error) {
        console.error('Error handling payment succeeded event:', error);
        return false;
    }
}

// Handle membership became valid events
async function handleMembershipValid(data) {
    try {
        const userId = data.user?.id || data.userId;
        const username = data.user?.username || data.username || 'New Member';
        
        if (!userId) {
            console.error('No user ID found in membership data:', data);
            return;
        }
        
        console.log(`✅ Membership became valid for user: ${userId} (${username})`);
        
        // Welcome message (would be sent via Whop SDK)
        const welcomeMessage = `🎉 Welcome to our community, ${username}! 

Thank you for joining us! We're excited to have you on board.

Here's what you can expect:
• Access to exclusive content
• Community discussions
• Regular updates and new features

If you have any questions, feel free to reach out to our support team.

Welcome aboard! 🚀`;

        console.log(`📧 WOULD SEND WELCOME MESSAGE TO ${username}:`);
        console.log(`   User ID: ${userId}`);
        console.log(`   Message: ${welcomeMessage}`);
        
        // TODO: Uncomment when @whop/api is properly configured
        // await whopSdk.messages.sendDirectMessageToUser({
        //     toUserIdOrUsername: userId,
        //     message: welcomeMessage,
        // });
        
        return true;
    } catch (error) {
        console.error('Error handling membership valid event:', error);
        return false;
    }
}

// Handle membership experience claimed events
async function handleMembershipClaimed(data) {
    try {
        const userId = data.user?.id || data.userId;
        const username = data.user?.username || data.username || 'New Member';
        
        if (!userId) {
            console.error('No user ID found in membership claim data:', data);
            return;
        }
        
        console.log(`✅ Membership claimed by user: ${userId} (${username})`);
        
        // Welcome message for claimed membership (would be sent via Whop SDK)
        const welcomeMessage = `🎉 Welcome to our community, ${username}! 

Thank you for claiming your membership! We're excited to have you on board.

Here's what you can expect:
• Access to exclusive content
• Community discussions
• Regular updates and new features

If you have any questions, feel free to reach out to our support team.

Welcome aboard! 🚀`;

        console.log(`📧 WOULD SEND WELCOME MESSAGE TO ${username}:`);
        console.log(`   User ID: ${userId}`);
        console.log(`   Message: ${welcomeMessage}`);
        
        // TODO: Uncomment when @whop/api is properly configured
        // await whopSdk.messages.sendDirectMessageToUser({
        //     toUserIdOrUsername: userId,
        //     message: welcomeMessage,
        // });
        
        return true;
    } catch (error) {
        console.error('Error handling membership claimed event:', error);
        return false;
    }
}

// Webhook endpoint for Whop events
export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Debug logging for all incoming requests
    console.log('🔍 Webhook request received:');
    console.log('   Method:', req.method);
    console.log('   Headers:', JSON.stringify(req.headers, null, 2));
    console.log('   Body:', JSON.stringify(req.body, null, 2));

    try {
        const payload = JSON.stringify(req.body);
        const signature = req.headers['x-whop-signature'] || req.headers['x-webhook-signature'];
        
        // Verify webhook signature
        if (!verifyWebhookSignature(payload, signature)) {
            console.error('❌ Invalid webhook signature');
            return res.status(401).json({ error: 'Invalid signature' });
        }
        
        console.log('🎉 Webhook received:', JSON.stringify(req.body, null, 2));
        
        const { event, data } = req.body;
        
        // Handle different webhook events based on actual available events
        switch (event) {
            case 'app_payment_succeeded':
            case 'payment_succeeded':
            case 'payment.succeeded':
                await handlePaymentSucceeded(data);
                break;
            case 'membership_went_valid':
            case 'app_membership_went_valid':
            case 'membership.went_valid':
            case 'membership_valid':
                await handleMembershipValid(data);
                break;
            case 'membership_experience_claimed':
            case 'membership.experience_claimed':
            case 'experience_claimed':
            case 'user.joined_community':
            case 'user_joined_community':
            case 'community.joined':
                await handleMembershipClaimed(data);
                break;
            case 'membership.created':
            case 'membership_created':
            case 'user.created':
            case 'user_created':
                await handleMembershipValid(data);
                break;
            default:
                console.log(`⚠️ Unhandled event type: ${event}`);
                console.log(`📋 Full webhook payload:`, JSON.stringify(req.body, null, 2));
        }
        
        res.status(200).json({ success: true, message: 'Webhook processed successfully' });
    } catch (error) {
        console.error('❌ Webhook error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
