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

// Simple messaging function (placeholder for now)
async function sendWelcomeMessage(userId, username) {
    console.log(`Would send welcome message to ${username} (${userId})`);
    return true;
}

async function sendPaymentConfirmation(userId, username, paymentData) {
    console.log(`Would send payment confirmation to ${username} (${userId}) for $${paymentData.amount}`);
    return true;
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
        
        console.log(`Processing payment confirmation for user: ${userId} (${username})`);
        
        // Send payment confirmation message
        const success = await sendPaymentConfirmation(userId, username, { amount });
        
        if (success) {
            console.log(`✅ Payment confirmation sent successfully to ${username}`);
        } else {
            console.error(`❌ Failed to send payment confirmation to ${username}`);
        }
    } catch (error) {
        console.error('Error handling payment succeeded event:', error);
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
        
        console.log(`Processing welcome message for valid membership: ${userId} (${username})`);
        
        // Send welcome message
        const success = await sendWelcomeMessage(userId, username);
        
        if (success) {
            console.log(`✅ Welcome message sent successfully to ${username}`);
        } else {
            console.error(`❌ Failed to send welcome message to ${username}`);
        }
    } catch (error) {
        console.error('Error handling membership valid event:', error);
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
        
        console.log(`Processing welcome message for claimed membership: ${userId} (${username})`);
        
        // Send welcome message
        const success = await sendWelcomeMessage(userId, username);
        
        if (success) {
            console.log(`✅ Welcome message sent successfully to ${username}`);
        } else {
            console.error(`❌ Failed to send welcome message to ${username}`);
        }
    } catch (error) {
        console.error('Error handling membership claimed event:', error);
    }
}

// Webhook endpoint for Whop events
export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const payload = JSON.stringify(req.body);
        const signature = req.headers['x-whop-signature'] || req.headers['x-webhook-signature'];
        
        // Verify webhook signature
        if (!verifyWebhookSignature(payload, signature)) {
            console.error('Invalid webhook signature');
            return res.status(401).json({ error: 'Invalid signature' });
        }
        
        console.log('Webhook received:', JSON.stringify(req.body, null, 2));
        
        const { event, data } = req.body;
        
        // Handle different webhook events based on actual available events
        switch (event) {
            case 'app_payment_succeeded':
            case 'payment_succeeded':
                await handlePaymentSucceeded(data);
                break;
            case 'membership_went_valid':
            case 'app_membership_went_valid':
                await handleMembershipValid(data);
                break;
            case 'membership_experience_claimed':
                await handleMembershipClaimed(data);
                break;
            default:
                console.log(`Unhandled event type: ${event}`);
        }
        
        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Webhook error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
