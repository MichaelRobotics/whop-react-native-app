const crypto = require('crypto');

// Webhook secret for authentication
const WEBHOOK_SECRET = process.env.WHOP_WEBHOOK_SECRET;

// Initialize Whop SDK for messaging
let whopSdk = null;
async function getWhopSdk() {
    if (!whopSdk) {
        try {
            const { WhopServerSdk } = await import('@whop/api');
            
            // Debug: Log which user ID is being used
            const personalUserId = process.env.WHOP_PERSONAL_USER_ID;
            const agentUserId = process.env.NEXT_PUBLIC_WHOP_AGENT_USER_ID;
            const finalUserId = personalUserId || agentUserId;
            
            console.log('🔧 SDK User ID Debug:');
            console.log('   WHOP_PERSONAL_USER_ID exists:', !!personalUserId);
            console.log('   WHOP_PERSONAL_USER_ID value:', personalUserId);
            console.log('   NEXT_PUBLIC_WHOP_AGENT_USER_ID value:', agentUserId);
            console.log('   Final user ID being used:', finalUserId);
            
            whopSdk = WhopServerSdk({
                appApiKey: process.env.WHOP_API_KEY,
                appId: process.env.NEXT_PUBLIC_WHOP_APP_ID,
                onBehalfOfUserId: finalUserId, // Use personal user ID if available, fallback to agent
            });
        } catch (error) {
            console.error('Failed to initialize Whop SDK:', error);
            return null;
        }
    }
    return whopSdk;
}

// Debug environment variables
console.log('🔧 Environment variables check:');
console.log('   WHOP_WEBHOOK_SECRET exists:', !!process.env.WHOP_WEBHOOK_SECRET);
console.log('   WHOP_WEBHOOK_SECRET length:', process.env.WHOP_WEBHOOK_SECRET ? process.env.WHOP_WEBHOOK_SECRET.length : 0);
console.log('   WHOP_WEBHOOK_SECRET starts with:', process.env.WHOP_WEBHOOK_SECRET ? process.env.WHOP_WEBHOOK_SECRET.substring(0, 10) + '...' : 'undefined');
console.log('   WHOP_PERSONAL_USER_ID exists:', !!process.env.WHOP_PERSONAL_USER_ID);
console.log('   WHOP_PERSONAL_USER_ID value:', process.env.WHOP_PERSONAL_USER_ID);
console.log('   NEXT_PUBLIC_WHOP_AGENT_USER_ID value:', process.env.NEXT_PUBLIC_WHOP_AGENT_USER_ID);

// Function to verify webhook signature
function verifyWebhookSignature(payload, signature) {
    if (!WEBHOOK_SECRET) {
        console.warn('No webhook secret configured, skipping signature verification');
        return true;
    }
    
    if (!signature) {
        console.warn('No signature provided, skipping signature verification');
        return true;
    }
    
    // Extract the actual signature hash from the format "t=timestamp,v1=hash"
    let signatureHash = signature;
    if (signature.includes('v1=')) {
        signatureHash = signature.split('v1=')[1];
    }
    
    const expectedSignature = crypto
        .createHmac('sha256', WEBHOOK_SECRET)
        .update(payload, 'utf8')
        .digest('hex');
    
    console.log('🔐 Signature verification:');
    console.log('   Received signature:', signature);
    console.log('   Extracted hash:', signatureHash);
    console.log('   Expected signature:', expectedSignature);
    console.log('   Payload:', payload);
    console.log('   Match:', signatureHash === expectedSignature);
    
    return crypto.timingSafeEqual(
        Buffer.from(signatureHash),
        Buffer.from(expectedSignature)
    );
}



// Handle membership became valid events
async function handleMembershipValid(data) {
    try {
        const userId = data.user?.id || data.userId || data.user_id;
        const username = data.user?.username || data.username || 'New Member';
        
        if (!userId) {
            console.error('No user ID found in membership data:', data);
            return;
        }
        
        console.log(`✅ Membership became valid for user: ${userId} (${username})`);
        
        // Send WebSocket interactive buttons + fallback text message
        console.log(`🎉 SENDING INTERACTIVE WELCOME TO ${username}:`);
        console.log(`   User ID: ${userId}`);
        
        try {
            // 1. Try to send WebSocket message with interactive buttons
            let websocketSent = false;
            try {
                const { WhopServerSdk } = await import('@whop/api');
                const whopApi = WhopServerSdk({
                    appApiKey: process.env.WHOP_API_KEY,
                });

                // Send interactive button data via WebSocket
                const buttonData = {
                    type: 'interactive_buttons',
                    title: '🚀 Ready to Level Up?',
                    subtitle: 'Choose your path to success:',
                    buttons: [
                        { id: 'dropshipping', text: '🛍️ Dropshipping!', description: 'Learn how to start your own online store', color: '#667eea', icon: '🛍️' },
                        { id: 'sports', text: '🏆 Sports!', description: 'Master sports betting and analysis', color: '#764ba2', icon: '🏆' },
                        { id: 'crypto', text: '💰 Crypto!', description: 'Dive into cryptocurrency trading', color: '#f093fb', icon: '💰' }
                    ],
                    animation: { type: 'slideIn', duration: 500, easing: 'easeOut' },
                    styling: { 
                        backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                        borderRadius: '12px', 
                        padding: '20px', 
                        boxShadow: '0 4px 15px rgba(0,0,0,0.1)' 
                    }
                };

                // Send to specific user via WebSocket
                await whopApi.sendWebsocketMessage({
                    message: JSON.stringify(buttonData),
                    target: { user: userId }
                });

                console.log(`✅ WebSocket interactive buttons sent successfully to ${username}`);
                websocketSent = true;
            } catch (websocketError) {
                console.log(`⚠️ WebSocket message failed (user may not be connected): ${websocketError.message}`);
            }

            // 2. Always send a fallback text message
            const fallbackMessage = `🎉 Welcome to our community, ${username}! 

Thank you for joining us! I'm excited to have you on board.

Here's what you can expect:
• Access to exclusive content
• Community discussions
• Regular updates and new features

If you have any questions, feel free to reach out to me directly.

Welcome aboard! 🚀

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 **Ready to Level Up?**

Simply reply with one of these options:

🛍️ **"Dropshipping"** - Learn how to start your own online store
🏆 **"Sports"** - Master sports betting and analysis  
💰 **"Crypto"** - Dive into cryptocurrency trading

Just type the word and I'll send you exclusive resources, affiliate links, and promo codes! 

Which path interests you most? 🎯

${websocketSent ? '*If you\'re using our app, you\'ll also see interactive buttons!*' : ''}`;

            const sdk = await getWhopSdk();
            if (sdk) {
                await sdk.messages.sendDirectMessageToUser({
                    toUserIdOrUsername: userId,
                    message: fallbackMessage,
                });
                console.log(`✅ Fallback welcome message sent successfully to ${username}`);
            } else {
                console.error('❌ Failed to initialize Whop SDK for welcome message');
            }
        } catch (error) {
            console.error(`❌ Error sending welcome message to ${username}:`, error);
        }

        return true;
        
        return true;
    } catch (error) {
        console.error('Error handling membership valid event:', error);
        return false;
    }


}

// Handle incoming messages and send automated responses
async function handleMessageSent(data) {
    try {
        const userId = data.user?.id || data.userId || data.user_id;
        const username = data.user?.username || data.username || 'User';
        const messageContent = data.content || data.message || '';

        if (!userId || !messageContent) {
            console.log('No user ID or message content found:', data);
            return;
        }

        console.log(`📨 Message received from ${username} (${userId}): "${messageContent}"`);

        // Check if message contains button click or keywords for automated responses
        const lowerMessage = messageContent.toLowerCase().trim();
        
        // Check for button click (user clicked the welcome button)
        if (lowerMessage.includes('click here to get started') || 
            lowerMessage.includes('get started') || 
            lowerMessage.includes('ready to level up')) {
            await sendChoiceButtons(userId, username);
        } else if (lowerMessage.includes('dropshipping')) {
            await sendAutomatedResponse(userId, username, 'dropshipping');
        } else if (lowerMessage.includes('sports')) {
            await sendAutomatedResponse(userId, username, 'sports');
        } else if (lowerMessage.includes('crypto')) {
            await sendAutomatedResponse(userId, username, 'crypto');
        } else {
            console.log(`📝 Message from ${username} doesn't match any keywords: "${messageContent}"`);
        }

    } catch (error) {
        console.error('Error handling message sent event:', error);
    }
}

// Send the 3 choice buttons when user clicks the welcome button
async function sendChoiceButtons(userId, username) {
    try {
        const choiceMessage = `🎯 **Choose Your Path to Success!**

Here are your options - just reply with the word:

🛍️ **"Dropshipping"** - Learn how to start your own online store
🏆 **"Sports"** - Master sports betting and analysis  
💰 **"Crypto"** - Dive into cryptocurrency trading

Which path interests you most? 🚀

*Simply type the word and I'll send you exclusive resources, affiliate links, and promo codes!*`;

        console.log(`🎯 SENDING CHOICE BUTTONS TO ${username}:`);
        console.log(`   User ID: ${userId}`);

        const sdk = await getWhopSdk();
        if (sdk) {
            await sdk.messages.sendDirectMessageToUser({
                toUserIdOrUsername: userId,
                message: choiceMessage,
            });
            console.log(`✅ Choice buttons sent successfully to ${username}`);
        } else {
            console.error('❌ Failed to initialize Whop SDK for choice buttons');
        }
    } catch (error) {
        console.error('❌ Error sending choice buttons:', error);
    }
}

// Send automated response based on user's choice
async function sendAutomatedResponse(userId, username, option) {
    try {
        const responses = {
            'dropshipping': `🎯 Perfect choice, ${username}! 

Dropshipping is one of the fastest ways to start an online business with minimal investment.

Here's your exclusive starter pack:
• 📚 Free Dropshipping Course: https://your-affiliate-link.com/dropshipping-course
• 🛒 Shopify 14-Day Trial: https://your-affiliate-link.com/shopify-trial
• 📊 Product Research Tool: https://your-affiliate-link.com/research-tool

Use promo code: DROPSHIP2024 for 20% off!

Ready to start your dropshipping journey? Let me know if you need help! 🚀`,

            'sports': `🏆 Excellent choice, ${username}! 

Sports betting and analysis can be incredibly profitable when done right.

Here's your exclusive sports package:
• 📊 Sports Analytics Platform: https://your-affiliate-link.com/sports-analytics
• 🎯 Betting Strategy Guide: https://your-affiliate-link.com/betting-guide
• 📱 Mobile App Access: https://your-affiliate-link.com/sports-app

Use promo code: SPORTS2024 for 15% off!

Want to learn more about sports analysis? I'm here to help! 💪`,

            'crypto': `💰 Smart choice, ${username}! 

Cryptocurrency is the future of finance and there's never been a better time to get started.

Here's your exclusive crypto starter kit:
• 📈 Trading Platform: https://your-affiliate-link.com/crypto-exchange
• 🎓 Crypto Education Course: https://your-affiliate-link.com/crypto-course
• 🔒 Hardware Wallet: https://your-affiliate-link.com/hardware-wallet

Use promo code: CRYPTO2024 for 25% off!

Ready to dive into the crypto world? Let's make it happen! 🚀`
        };

        const response = responses[option];
        if (!response) {
            console.error(`❌ No response found for option: ${option}`);
            return;
        }

        console.log(`📧 SENDING AUTOMATED RESPONSE TO ${username}:`);
        console.log(`   Option: ${option}`);
        console.log(`   User ID: ${userId}`);

        // Send the response via Whop SDK
        try {
            const sdk = await getWhopSdk();
            if (sdk) {
                await sdk.messages.sendDirectMessageToUser({
                    toUserIdOrUsername: userId,
                    message: response,
                });
                console.log(`✅ Automated response sent successfully to ${username} for ${option}`);
            } else {
                console.error('❌ Failed to initialize Whop SDK for automated response');
            }
        } catch (error) {
            console.error('❌ Error sending automated response:', error);
        }

    } catch (error) {
        console.error('Error in sendAutomatedResponse:', error);
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
            console.log('⚠️ Temporarily bypassing signature verification for testing...');
            // TODO: Remove this bypass once signature verification is working
            // return res.status(401).json({ error: 'Invalid signature' });
        }
        
        console.log('🎉 Webhook received:', JSON.stringify(req.body, null, 2));
        
        const { event, action, data } = req.body;
        const eventType = event || action; // Handle both 'event' and 'action' fields
        
        console.log(`🔍 Processing event type: ${eventType}`);
        
                            // Handle different webhook events based on actual available events
                    switch (eventType) {
                        case 'membership_went_valid':
                        case 'app_membership_went_valid':
                        case 'membership.went_valid':
                        case 'membership_valid':
                        case 'membership_experience_claimed':
                        case 'membership.experience_claimed':
                        case 'experience_claimed':
                        case 'user.joined_community':
                        case 'user_joined_community':
                        case 'community.joined':
                        case 'membership.created':
                        case 'membership_created':
                        case 'user.created':
                        case 'user_created':
                            await handleMembershipValid(data);
                            break;
                        case 'message.sent':
                        case 'message_sent':
                        case 'chat.message':
                        case 'direct_message':
                            await handleMessageSent(data);
                            break;
                        default:
                            console.log(`⚠️ Unhandled event type: ${eventType}`);
                            console.log(`📋 Full webhook payload:`, JSON.stringify(req.body, null, 2));
                    }
        
        res.status(200).json({ success: true, message: 'Webhook processed successfully' });
    } catch (error) {
        console.error('❌ Webhook error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
