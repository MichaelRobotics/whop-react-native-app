// Button response handler for interactive welcome message
export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { userId, username, option } = req.body;

        if (!userId || !option) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Define responses for each option
        const responses = {
            'dropshipping': {
                message: `🎯 Perfect choice, ${username}! 

Dropshipping is one of the fastest ways to start an online business with minimal investment.

Here's your exclusive starter pack:
• 📚 Free Dropshipping Course: https://your-affiliate-link.com/dropshipping-course
• 🛒 Shopify 14-Day Trial: https://your-affiliate-link.com/shopify-trial
• 📊 Product Research Tool: https://your-affiliate-link.com/research-tool

Use promo code: DROPSHIP2024 for 20% off!

Ready to start your dropshipping journey? Let me know if you need help! 🚀`,
                affiliateLinks: [
                    'https://your-affiliate-link.com/dropshipping-course',
                    'https://your-affiliate-link.com/shopify-trial',
                    'https://your-affiliate-link.com/research-tool'
                ]
            },
            'sports': {
                message: `🏆 Excellent choice, ${username}! 

Sports betting and analysis can be incredibly profitable when done right.

Here's your exclusive sports package:
• 📊 Sports Analytics Platform: https://your-affiliate-link.com/sports-analytics
• 🎯 Betting Strategy Guide: https://your-affiliate-link.com/betting-guide
• 📱 Mobile App Access: https://your-affiliate-link.com/sports-app

Use promo code: SPORTS2024 for 15% off!

Want to learn more about sports analysis? I'm here to help! 💪`,
                affiliateLinks: [
                    'https://your-affiliate-link.com/sports-analytics',
                    'https://your-affiliate-link.com/betting-guide',
                    'https://your-affiliate-link.com/sports-app'
                ]
            },
            'crypto': {
                message: `💰 Smart choice, ${username}! 

Cryptocurrency is the future of finance and there's never been a better time to get started.

Here's your exclusive crypto starter kit:
• 📈 Trading Platform: https://your-affiliate-link.com/crypto-exchange
• 🎓 Crypto Education Course: https://your-affiliate-link.com/crypto-course
• 🔒 Hardware Wallet: https://your-affiliate-link.com/hardware-wallet

Use promo code: CRYPTO2024 for 25% off!

Ready to dive into the crypto world? Let's make it happen! 🚀`,
                affiliateLinks: [
                    'https://your-affiliate-link.com/crypto-exchange',
                    'https://your-affiliate-link.com/crypto-course',
                    'https://your-affiliate-link.com/hardware-wallet'
                ]
            }
        };

        const response = responses[option];
        if (!response) {
            return res.status(400).json({ error: 'Invalid option' });
        }

        // Send the response message to the user
        try {
            const { WhopServerSdk } = await import('@whop/api');
            const whopSdk = WhopServerSdk({
                appApiKey: process.env.WHOP_API_KEY,
                appId: process.env.NEXT_PUBLIC_WHOP_APP_ID,
                onBehalfOfUserId: process.env.WHOP_PERSONAL_USER_ID || process.env.NEXT_PUBLIC_WHOP_AGENT_USER_ID,
            });

            await whopSdk.messages.sendDirectMessageToUser({
                toUserIdOrUsername: userId,
                message: response.message,
            });

            console.log(`✅ Sent ${option} response to ${username} (${userId})`);
            console.log(`📊 Affiliate links sent:`, response.affiliateLinks);

            res.status(200).json({ 
                success: true, 
                message: 'Response sent successfully',
                option: option,
                affiliateLinks: response.affiliateLinks
            });

        } catch (error) {
            console.error('❌ Error sending response message:', error);
            res.status(500).json({ error: 'Failed to send response message' });
        }

    } catch (error) {
        console.error('❌ Button response error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
