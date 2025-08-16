const express = require('express');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.static('public'));

// Create public directory if it doesn't exist
if (!fs.existsSync('public')) {
    fs.mkdirSync('public');
}

// Webhook secret (you should set this in your environment variables)
const WEBHOOK_SECRET = process.env.WHOP_WEBHOOK_SECRET || 'your_webhook_secret_here';

// Store for tracking greeted users (in production, use a database)
const greetedUsers = new Set();

// Webhook signature verification
function verifyWebhookSignature(payload, signature) {
    const expectedSignature = crypto
        .createHmac('sha256', WEBHOOK_SECRET)
        .update(payload, 'utf8')
        .digest('hex');
    
    return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature)
    );
}

// Send greeting message to user
async function sendGreetingMessage(userId, userName) {
    try {
        // In a real implementation, you would use the Whop API to send messages
        // For now, we'll simulate the API call
        const greetingData = {
            user_id: userId,
            message: `👋 Welcome to our community, ${userName || 'friend'}! We're excited to have you here! 🎉`,
            type: 'text',
            timestamp: new Date().toISOString()
        };
        
        console.log('📨 Sending greeting message:', greetingData);
        
        // Simulate API call to Whop messaging API
        // In production, you would make an actual HTTP request to Whop's API
        // const response = await fetch('https://api.whop.com/v2/messages', {
        //     method: 'POST',
        //     headers: {
        //         'Authorization': `Bearer ${process.env.WHOP_APP_SECRET}`,
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify(greetingData)
        // });
        
        return { success: true, data: greetingData };
    } catch (error) {
        console.error('❌ Error sending greeting message:', error);
        return { success: false, error: error.message };
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

// Write the HTML file
fs.writeFileSync(path.join(__dirname, 'public', 'index.html'), htmlContent);

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/webhook-test', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'webhook-test.html'));
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

// Webhook endpoint for handling Whop events
app.post('/webhook/whop', async (req, res) => {
    try {
        const signature = req.headers['whop-signature'];
        const payload = JSON.stringify(req.body);
        
        // Verify webhook signature (uncomment in production)
        // if (!verifyWebhookSignature(payload, signature)) {
        //     console.log('❌ Invalid webhook signature');
        //     return res.status(401).json({ error: 'Invalid signature' });
        // }
        
        const event = req.body;
        console.log('📥 Received webhook event:', event.type);
        
        // Handle different event types
        switch (event.type) {
            case 'user.joined_community':
                await handleUserJoinedCommunity(event);
                break;
            case 'user.sent_message':
                await handleUserMessage(event);
                break;
            case 'user.entered_experience':
                await handleUserEnteredExperience(event);
                break;
            default:
                console.log('📋 Unhandled event type:', event.type);
        }
        
        res.status(200).json({ success: true, message: 'Webhook processed' });
    } catch (error) {
        console.error('❌ Webhook error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Handle user joining community
async function handleUserJoinedCommunity(event) {
    const userId = event.data.user.id;
    const userName = event.data.user.username || event.data.user.name;
    
    console.log(`🎉 User ${userName} (${userId}) joined the community!`);
    
    // Check if we've already greeted this user
    if (greetedUsers.has(userId)) {
        console.log(`👋 User ${userId} already greeted, skipping...`);
        return;
    }
    
    // Send greeting message
    const result = await sendGreetingMessage(userId, userName);
    
    if (result.success) {
        greetedUsers.add(userId);
        console.log(`✅ Greeting sent to ${userName} (${userId})`);
    } else {
        console.log(`❌ Failed to send greeting to ${userName} (${userId}):`, result.error);
    }
}

// Handle user messages
async function handleUserMessage(event) {
    const userId = event.data.user.id;
    const userName = event.data.user.username || event.data.user.name;
    const message = event.data.message;
    
    console.log(`💬 Message from ${userName} (${userId}): ${message}`);
    
    // You can add custom message handling logic here
    // For example, auto-replies, moderation, etc.
}

// Handle user entering experience
async function handleUserEnteredExperience(event) {
    const userId = event.data.user.id;
    const userName = event.data.user.username || event.data.user.name;
    const experienceId = event.data.experience.id;
    
    console.log(`🎯 User ${userName} (${userId}) entered experience ${experienceId}`);
    
    // You can add custom experience entry logic here
    // For example, tracking analytics, sending welcome messages, etc.
}

// Webhook status endpoint
app.get('/webhook/status', (req, res) => {
    res.json({
        status: 'active',
        greetedUsers: Array.from(greetedUsers),
        totalGreeted: greetedUsers.size,
        timestamp: new Date().toISOString()
    });
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
   - http://localhost:${PORT}/webhook/whop - Webhook endpoint
   - http://localhost:${PORT}/webhook/status - Webhook status

💡 This is a web preview of your React Native app.
   To test the actual mobile app, deploy it to Whop first!

🔔 Webhook Features:
   - Auto-greeting when users join community
   - Message handling and logging
   - Experience entry tracking
    `);
});
