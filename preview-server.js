const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.static('public'));

// Simple redirect to Whop app for unauthorized users
app.get('/', (req, res) => {
    // In production, redirect to Whop app
    if (process.env.NODE_ENV === 'production') {
        const isWhopRequest = req.headers['user-agent']?.includes('Whop') || 
                             req.query.whop_user_id || 
                             req.headers['x-whop-signature'];
        
        if (!isWhopRequest) {
            return res.redirect('https://whop.com/apps/app_FInBMCJGyVdD9T');
        }
    }
    
    // For development, show a simple info page
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Whop Chat App - Development Server</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 40px; text-align: center; }
                .container { max-width: 600px; margin: 0 auto; }
                .status { background: #28a745; color: white; padding: 20px; border-radius: 10px; margin: 20px 0; }
                .info { background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0; }
                .endpoint { background: #e9ecef; padding: 10px; border-radius: 5px; font-family: monospace; margin: 10px 0; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>🚀 Whop Chat App</h1>
                
                <div class="status">
                    ✅ Development Server Running
                </div>
                
                <div class="info">
                    <h3>📱 Available Endpoints:</h3>
                    <div class="endpoint">GET / - This page</div>
                    <div class="endpoint">POST /api/webhook - Webhook handler</div>
                    <div class="endpoint">POST /api/button-response - Button responses</div>
                    <div class="endpoint">GET /api/preview-info - Server info</div>
                </div>
                
                <div class="info">
                    <h3>🔧 Development Info:</h3>
                    <p>This server provides the backend API for your Whop React Native app.</p>
                    <p>The chat interface is handled by React Native components in the Whop mobile app.</p>
                    <p>Webhook URL: <code>http://localhost:${PORT}/api/webhook</code></p>
                </div>
                
                <div class="info">
                    <h3>📋 Next Steps:</h3>
                    <p>1. Deploy to Vercel: <code>vercel --prod</code></p>
                    <p>2. Configure webhook in Whop dashboard</p>
                    <p>3. Test with real users in Whop mobile app</p>
                </div>
            </div>
        </body>
        </html>
    `);
});

app.get('/api/preview-info', (req, res) => {
    res.json({
        message: 'Whop Chat App Development Server',
        status: 'running',
        timestamp: new Date().toISOString(),
        appInfo: {
            name: 'Chat App',
            version: '1.0.0',
            type: 'Whop React Native App',
            features: ['Interactive Chat', 'Webhook Integration', 'Automated Responses'],
            endpoints: {
                webhook: '/api/webhook',
                buttonResponse: '/api/button-response',
                previewInfo: '/api/preview-info'
            }
        }
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`
🚀 Whop Chat App Development Server
==========================================
✅ Server running at: http://localhost:${PORT}
📱 API endpoints available:
   - POST /api/webhook (Webhook handler)
   - POST /api/button-response (Button responses)
   - GET /api/preview-info (Server info)

💡 This server provides the backend for your Whop React Native app!
    `);
});
