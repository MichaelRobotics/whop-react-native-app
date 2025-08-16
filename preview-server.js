const express = require('express');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.static('public'));

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

// Import the messaging service
const { sendWelcomeMessage, sendPaymentConfirmation } = require('./src/services/messaging-service.js');

// Webhook endpoint for Whop events
app.post('/webhook', async (req, res) => {
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
});

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

// Create the HTML preview page
const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Whop React Native App Preview</title>
    <script>
        // Redirect unauthorized users
        if (!window.location.search.includes('whop_user_id') && !window.location.search.includes('preview=true')) {
            window.location.href = 'https://whop.com/apps/app_FInBMCJGyVdD9T';
        }
    </script>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: #f5f5f5;
            padding: 20px;
        }
        
        .container {
            max-width: 400px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px 20px;
            text-align: center;
        }
        
        .header h1 {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        
        .header p {
            font-size: 16px;
            opacity: 0.9;
        }
        
        .content {
            padding: 20px;
        }
        
        .info-container {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 10px;
            margin-bottom: 20px;
            border: 1px solid #e9ecef;
        }
        
        .info-text {
            font-size: 14px;
            color: #333;
            margin-bottom: 8px;
            font-family: 'Monaco', 'Menlo', monospace;
            word-break: break-all;
        }
        
        .button {
            background: #007AFF;
            color: white;
            border: none;
            padding: 15px 30px;
            border-radius: 25px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            width: 100%;
            margin-bottom: 20px;
            transition: background-color 0.2s;
        }
        
        .button:hover {
            background: #0056b3;
        }
        
        .description {
            font-size: 14px;
            color: #666;
            text-align: center;
            line-height: 1.5;
        }
        
        .mobile-frame {
            border: 2px solid #ddd;
            border-radius: 20px;
            padding: 10px;
            background: #000;
            margin-bottom: 20px;
        }
        
        .status {
            background: #28a745;
            color: white;
            padding: 10px;
            border-radius: 5px;
            text-align: center;
            margin-bottom: 20px;
        }
        
        .instructions {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 5px;
            padding: 15px;
            margin-bottom: 20px;
        }
        
        .instructions h3 {
            color: #856404;
            margin-bottom: 10px;
        }
        
        .instructions ul {
            color: #856404;
            padding-left: 20px;
        }
        
        .instructions li {
            margin-bottom: 5px;
        }
    </style>
</head>
<body>
    <div class="status">
        ✅ React Native App Preview - Running Locally
    </div>
    
    <div class="instructions">
        <h3>📱 How to Test Your App:</h3>
        <ul>
            <li>This is a <strong>preview</strong> of your React Native app</li>
            <li>To test the real app, you need to deploy it to Whop</li>
            <li>Use <code>pnpm ship</code> to deploy with real credentials</li>
            <li>Then test in the Whop mobile app</li>
        </ul>
    </div>
    
    <div class="mobile-frame">
        <div class="container">
            <div class="header">
                <h1>🚀 Whop React Native App</h1>
                <p>Welcome to your new React Native app!</p>
            </div>
            
            <div class="content">
                <div class="info-container">
                    <div class="info-text">Company ID: demo-company-123</div>
                    <div class="info-text">Experience ID: demo-experience-456</div>
                    <div class="info-text">Current User ID: demo-user-789</div>
                    <div class="info-text">Path: /experience</div>
                </div>
                
                <button class="button" onclick="greetUser()">
                    👋 Greet User
                </button>
                
                <div class="description">
                    This is a React Native app built with the Whop SDK. 
                    You can customize this view to create amazing mobile experiences!
                </div>
            </div>
        </div>
    </div>
    
    <script>
        function greetUser() {
            alert('Hello demo-user-789! Welcome to experience demo-experience-456');
        }
        
        // Simulate mobile app behavior
        console.log('🚀 Whop React Native App Preview Loaded');
        console.log('📱 This simulates how your app will look in the Whop mobile app');
    </script>
</body>
</html>
`;

// Serverless-compatible: serve HTML directly instead of writing to filesystem



// Routes - Serverless-compatible (serve HTML directly)
app.get('/', (req, res) => {
    // In production, only allow Whop requests
    if (process.env.NODE_ENV === 'production') {
        const isWhopRequest = req.headers['user-agent']?.includes('Whop') || 
                             req.query.whop_user_id || 
                             req.headers['x-whop-signature'];
        
        if (!isWhopRequest) {
            // Redirect unauthorized users to Whop
            return res.redirect('https://whop.com/apps/app_FInBMCJGyVdD9T');
        }
    }
    
    // Serve the main app preview for authorized users
    res.send(htmlContent);
});



app.get('/api/preview-info', (req, res) => {
    res.json({
        message: 'Whop React Native App Preview Server',
        status: 'running',
        timestamp: new Date().toISOString(),
        appInfo: {
            name: 'React Native App',
            version: '0.0.1',
            type: 'Whop React Native App',
            preview: true
        }
    });
});

// Experience route for testing - serves the visual preview
app.get('/experiences/:experienceId', (req, res) => {
    const experienceId = req.params.experienceId;
    
    // Create a custom HTML page for this specific experience
    const experienceHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Whop Experience: ${experienceId}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: #f5f5f5;
            padding: 20px;
        }
        
        .container {
            max-width: 400px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px 20px;
            text-align: center;
        }
        
        .header h1 {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        
        .header p {
            font-size: 16px;
            opacity: 0.9;
        }
        
        .content {
            padding: 20px;
        }
        
        .info-container {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 10px;
            margin-bottom: 20px;
            border: 1px solid #e9ecef;
        }
        
        .info-text {
            font-size: 14px;
            color: #333;
            margin-bottom: 8px;
            font-family: 'Monaco', 'Menlo', monospace;
            word-break: break-all;
        }
        
        .button {
            background: #007AFF;
            color: white;
            border: none;
            padding: 15px 30px;
            border-radius: 25px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            width: 100%;
            margin-bottom: 20px;
            transition: background-color 0.2s;
        }
        
        .button:hover {
            background: #0056b3;
        }
        
        .description {
            font-size: 14px;
            color: #666;
            line-height: 1.5;
        }
        
        .status {
            background: #d4edda;
            color: #155724;
            padding: 15px;
            border-radius: 10px;
            margin-bottom: 20px;
            text-align: center;
            font-weight: 600;
        }
        
        .instructions {
            background: #fff3cd;
            color: #856404;
            padding: 15px;
            border-radius: 10px;
            margin-bottom: 20px;
        }
        
        .instructions h3 {
            margin-bottom: 10px;
        }
        
        .instructions ul {
            list-style: none;
            padding-left: 0;
        }
        
        .instructions li {
            margin-bottom: 5px;
        }
    </style>
</head>
<body>
    <div class="status">
        ✅ Experience Preview - ${experienceId}
    </div>
    
    <div class="instructions">
        <h3>📱 Experience View Preview:</h3>
        <ul>
            <li>This shows the <strong>experience view</strong> of your React Native app</li>
            <li>Experience ID: <code>${experienceId}</code></li>
            <li>This simulates the main app interface users will see</li>
        </ul>
    </div>
    
    <div class="mobile-frame">
        <div class="container">
            <div class="header">
                <h1>🚀 Whop Experience</h1>
                <p>Welcome to your experience!</p>
            </div>
            
            <div class="content">
                <div class="info-container">
                    <div class="info-text">Experience ID: ${experienceId}</div>
                    <div class="info-text">Company ID: demo-company-123</div>
                    <div class="info-text">Current User ID: demo-user-789</div>
                    <div class="info-text">View Type: experience-view</div>
                </div>
                
                <button class="button" onclick="interactWithExperience()">
                    🎯 Interact with Experience
                </button>
                
                <div class="description">
                    This is the experience view of your React Native app. 
                    Users will see this interface when they access your experience through the Whop mobile app.
                </div>
            </div>
        </div>
    </div>
    
    <script>
        function interactWithExperience() {
            alert('Interacting with experience: ${experienceId}');
        }
        
        // Simulate mobile app behavior
        console.log('🚀 Whop Experience Preview Loaded');
        console.log('📱 Experience ID: ${experienceId}');
        console.log('🎯 This simulates the experience view in the Whop mobile app');
    </script>
</body>
</html>`;
    
    res.send(experienceHtml);
});



// Start server
app.listen(PORT, () => {
    console.log(`
🚀 Whop React Native App Preview Server
==========================================
✅ Server running at: http://localhost:${PORT}
📱 Preview your app in the browser
🔧 To test the real app, use: pnpm ship

📋 Available endpoints:
   - http://localhost:${PORT} - App preview
   - http://localhost:${PORT}/api/preview-info - Server info
   - http://localhost:${PORT}/experiences/:id - Experience preview

💡 This is a web preview of your React Native app.
   To test the actual mobile app, deploy it to Whop first!
    `);
});
