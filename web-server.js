const express = require('express');
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Import the React Native views
const { ExperienceView } = require('./src/views/experience-view.tsx');
const { DiscoverView } = require('./src/views/discover-view.tsx');

// Helper function to render React component to HTML
function renderComponent(Component, props) {
    const element = React.createElement(Component, props);
    return ReactDOMServer.renderToString(element);
}

// Create HTML template
function createHTML(content, title = 'Whop Chat App') {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: #f8f9fa;
            height: 100vh;
            overflow: hidden;
        }
        
        #root {
            height: 100vh;
        }
        
        /* React Native Web styles */
        .react-native-view {
            display: flex;
            flex-direction: column;
            height: 100vh;
            background-color: #f8f9fa;
        }
    </style>
</head>
<body>
    <div id="root">
        ${content}
    </div>
    
    <script>
        // Client-side hydration and interactivity
        console.log('🚀 Whop Chat App loaded');
        
        // Add any client-side functionality here
        document.addEventListener('DOMContentLoaded', function() {
            console.log('📱 Chat interface ready');
        });
    </script>
</body>
</html>`;
}

// Routes
app.get('/', (req, res) => {
    // Default to experience view
    const props = {
        currentUserId: req.query.userId || 'demo-user',
        experienceId: req.query.experienceId || 'demo-experience',
        companyId: req.query.companyId || 'demo-company',
        path: ['experience']
    };
    
    const content = renderComponent(ExperienceView, props);
    const html = createHTML(content, 'Whop Chat App - Experience View');
    
    res.send(html);
});

app.get('/experiences/:experienceId', (req, res) => {
    const props = {
        currentUserId: req.query.userId || 'demo-user',
        experienceId: req.params.experienceId,
        companyId: req.query.companyId || 'demo-company',
        path: ['experiences', req.params.experienceId]
    };
    
    const content = renderComponent(ExperienceView, props);
    const html = createHTML(content, `Whop Chat App - Experience ${req.params.experienceId}`);
    
    res.send(html);
});

app.get('/discover', (req, res) => {
    const props = {
        currentUserId: req.query.userId || 'demo-user',
        path: ['discover']
    };
    
    const content = renderComponent(DiscoverView, props);
    const html = createHTML(content, 'Whop Chat App - Discover View');
    
    res.send(html);
});

// API routes
app.get('/api/preview-info', (req, res) => {
    res.json({
        message: 'Whop Chat App Web Server',
        status: 'running',
        timestamp: new Date().toISOString(),
        appInfo: {
            name: 'Chat App',
            version: '1.0.0',
            type: 'Whop React Native App (Web)',
            features: ['Interactive Chat', 'WebSocket Integration', 'Automated Responses']
        }
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`
🚀 Whop Chat App Web Server
==========================================
✅ Server running at: http://localhost:${PORT}
📱 Chat interface available at:
   - http://localhost:${PORT} (Experience View)
   - http://localhost:${PORT}/discover (Discover View)
   - http://localhost:${PORT}/experiences/:id (Specific Experience)

💡 This server renders the React Native app for web browsers
    `);
});

module.exports = app;
