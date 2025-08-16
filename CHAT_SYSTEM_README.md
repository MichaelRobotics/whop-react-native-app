# 🚀 Whop Interactive Chat System

A complete React Native chat application that provides interactive conversations between Whop owners and users, featuring animated buttons and automated responses.

## 📱 Features

### ✨ **Interactive Chat Interface**
- **Real-time messaging** between Whop owner and users
- **Beautiful chat bubbles** with timestamps
- **Smooth animations** and transitions
- **Responsive design** for all screen sizes

### 🎯 **Interactive Buttons**
- **Animated button cards** that slide in from the side
- **Three choice options**: Dropshipping, Sports, Crypto
- **Gradient styling** with hover effects
- **Automatic hiding** after user selection

### 🤖 **Automated Responses**
- **Smart keyword detection** in user messages
- **Personalized affiliate responses** with links and promo codes
- **Fallback responses** for unrecognized messages
- **Server-side processing** via webhook

### 🔌 **WebSocket Integration**
- **Real-time communication** with Whop's WebSocket API
- **Connection status indicators**
- **Automatic reconnection** on connection loss
- **Heartbeat monitoring**

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   React Native  │    │   WebSocket      │    │   Webhook       │
│   Chat App      │◄──►│   Client         │◄──►│   Server        │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   ChatInterface │    │   WhopWebSocket  │    │   api/webhook   │
│   Component     │    │   Client         │    │   Endpoint      │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 📁 File Structure

```
src/
├── components/
│   ├── ChatInterface.js      # Main chat UI component
│   └── WhopWebSocketClient.js # WebSocket connection handler
├── App.js                    # Main app component
└── views/                    # Additional view components

api/
├── webhook.js               # Webhook endpoint for user events
└── button-response.js       # Button response handler

test-webhook.js              # Webhook testing script
```

## 🚀 Getting Started

### 1. **Installation**

```bash
# Install dependencies
npm install

# For React Native development
npx react-native install
```

### 2. **Environment Setup**

Create a `.env.local` file with your Whop credentials:

```env
WHOP_API_KEY=your_api_key_here
WHOP_WEBHOOK_SECRET=your_webhook_secret_here
NEXT_PUBLIC_WHOP_APP_ID=your_app_id_here
NEXT_PUBLIC_WHOP_AGENT_USER_ID=your_agent_user_id
WHOP_PERSONAL_USER_ID=your_personal_user_id
```

### 3. **Deploy to Vercel**

```bash
# Deploy the webhook server
vercel --prod
```

### 4. **Configure Webhook**

1. Go to your Whop Developer Dashboard
2. Add webhook URL: `https://your-app.vercel.app/api/webhook`
3. Select events: `membership.went_valid`, `message.sent`
4. Save the webhook secret

### 5. **Run React Native App**

```bash
# iOS
npx react-native run-ios

# Android
npx react-native run-android
```

## 💬 How It Works

### **User Journey**

1. **User joins whop** → Webhook triggers
2. **Welcome message sent** → Via direct message
3. **Interactive buttons appear** → Via WebSocket (if app user)
4. **User selects option** → Buttons animate and hide
5. **Automated response sent** → With affiliate links and promo codes

### **Message Flow**

```
User Joins Whop
       │
       ▼
   Webhook Triggered
       │
       ▼
   Welcome Message Sent
       │
       ▼
   WebSocket Buttons Sent (if app user)
       │
       ▼
   User Interacts
       │
       ▼
   Automated Response
```

## 🎨 Customization

### **Button Options**

Edit the button data in `api/webhook.js`:

```javascript
const buttonData = {
    type: 'interactive_buttons',
    title: '🚀 Ready to Level Up?',
    subtitle: 'Choose your path to success:',
    buttons: [
        { 
            id: 'dropshipping', 
            text: '🛍️ Dropshipping!', 
            description: 'Learn how to start your own online store', 
            color: '#667eea', 
            icon: '🛍️' 
        },
        // Add more buttons here...
    ]
};
```

### **Affiliate Responses**

Customize responses in `api/button-response.js`:

```javascript
const responses = {
    'dropshipping': {
        message: 'Your dropshipping response...',
        affiliateLinks: [
            'https://your-affiliate-link.com/course',
            'https://your-affiliate-link.com/tools'
        ]
    }
    // Add more responses...
};
```

### **Styling**

Modify the chat appearance in `src/components/ChatInterface.js`:

```javascript
const styles = StyleSheet.create({
    // Customize colors, fonts, spacing...
    sentBubble: {
        backgroundColor: '#667eea', // Your brand color
    },
    receivedBubble: {
        backgroundColor: 'white',
    }
});
```

## 🔧 Configuration

### **WebSocket Settings**

Configure WebSocket behavior in `src/components/WhopWebSocketClient.js`:

```javascript
// Heartbeat interval (30 seconds)
heartbeatIntervalRef.current = setInterval(() => {
    // Send ping to keep connection alive
}, 30000);

// Reconnection delay (5 seconds)
reconnectTimeoutRef.current = setTimeout(connectWebSocket, 5000);
```

### **Animation Settings**

Adjust animations in `src/components/ChatInterface.js`:

```javascript
// Button slide-in animation
Animated.timing(slideAnim, {
    toValue: 0,
    duration: 500, // Animation duration
    useNativeDriver: true,
}).start();
```

## 🧪 Testing

### **Test Webhook**

```bash
# Test the webhook endpoint
node test-webhook.js
```

### **Test Chat Interface**

1. Open the React Native app
2. Wait for welcome message
3. Interactive buttons should appear after 3 seconds
4. Test button interactions
5. Verify automated responses

## 📊 Monitoring

### **Logs**

Monitor the system via Vercel logs:

```bash
vercel logs https://your-app.vercel.app
```

### **Key Metrics**

- Webhook delivery success rate
- WebSocket connection stability
- User interaction completion rate
- Response time for automated messages

## 🚨 Troubleshooting

### **Common Issues**

1. **WebSocket not connecting**
   - Check app ID and user ID
   - Verify network connectivity
   - Check Whop API key permissions

2. **Buttons not appearing**
   - Ensure WebSocket connection is active
   - Check message format in webhook
   - Verify user is using the app

3. **Responses not sending**
   - Check webhook endpoint configuration
   - Verify environment variables
   - Check Whop API rate limits

### **Debug Mode**

Enable debug logging:

```javascript
// In ChatInterface.js
console.log('🔍 Debug: Message received:', message);
console.log('🔍 Debug: Button pressed:', button);
```

## 🔒 Security

### **Authentication**

- All API calls require valid Whop API key
- Webhook signature verification
- User authentication via Whop tokens

### **Data Protection**

- No sensitive data stored locally
- All communication encrypted
- Secure WebSocket connections

## 📈 Performance

### **Optimizations**

- Message virtualization for large chats
- Image caching and compression
- Efficient WebSocket reconnection
- Minimal re-renders with React.memo

### **Scalability**

- Serverless webhook architecture
- Horizontal scaling via Vercel
- WebSocket connection pooling
- Rate limiting and throttling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:

- Check the troubleshooting section
- Review Whop documentation
- Open an issue on GitHub
- Contact the development team

---

**Built with ❤️ for the Whop community**
