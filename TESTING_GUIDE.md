# 🧪 Webhook Testing Guide

## Overview
This guide shows you how to test your Whop webhook functionality (including greeting messages) without deploying to the app store or giving access to all users.

## 🚀 Quick Start Testing

### Method 1: Local Testing Interface (Easiest)
1. **Start your server**: `node preview-server.js`
2. **Open testing interface**: http://localhost:3000/webhook-test
3. **Test greeting messages**: 
   - Select "User Joined Community"
   - Enter test user details
   - Click "Send Test Webhook"
   - Watch the greeting message being sent!

### Method 2: Real Whop Events with ngrok (Recommended)

#### Step 1: Create Public URL
```bash
# In a new terminal, create a public tunnel
ngrok http 3000
```

You'll get a URL like: `https://abc123.ngrok.io`

#### Step 2: Configure Whop Webhook
1. Go to your [Whop Developer Dashboard](https://whop.com/dashboard/developer)
2. Find your app settings
3. Set webhook URL to: `https://your-ngrok-url.ngrok.io/webhook/whop`
4. Save the configuration

#### Step 3: Test with Real Users
1. **Share your Whop link** with specific people (friends, family, testers)
2. **When they join**, your webhook will receive real events
3. **Greeting messages** will be sent automatically
4. **Monitor logs** in your server console

### Method 3: Direct API Testing
```bash
# Test user join event
curl -X POST http://localhost:3000/webhook/whop \
  -H "Content-Type: application/json" \
  -d '{
    "type": "user.joined_community",
    "data": {
      "user": {
        "id": "test_user_123",
        "username": "testuser",
        "name": "Test User"
      }
    }
  }'

# Check webhook status
curl http://localhost:3000/webhook/status
```

## 📊 Monitoring & Debugging

### Server Logs
Your server console will show:
```
📥 Received webhook event: user.joined_community
🎉 User testuser (test_user_123) joined the community!
📨 Sending greeting message: { user_id: 'test_user_123', message: '...' }
✅ Greeting sent to testuser (test_user_123)
```

### Webhook Status
Visit: http://localhost:3000/webhook/status
```json
{
  "status": "active",
  "greetedUsers": ["test_user_123", "user_456"],
  "totalGreeted": 2,
  "timestamp": "2025-08-16T14:30:00.000Z"
}
```

### Testing Interface
Visit: http://localhost:3000/webhook-test
- Real-time event logging
- Test different event types
- Monitor webhook status
- Clear logs and retest

## 🔧 Customization

### Modify Greeting Message
Edit the `sendGreetingMessage` function in `preview-server.js`:

```javascript
const greetingData = {
    user_id: userId,
    message: `🎉 Welcome ${userName}! Thanks for joining our amazing community! 🚀`,
    type: 'text',
    timestamp: new Date().toISOString()
};
```

### Add More Event Handlers
```javascript
// Handle user messages
async function handleUserMessage(event) {
    const message = event.data.message;
    
    // Auto-reply to specific keywords
    if (message.toLowerCase().includes('hello')) {
        await sendGreetingMessage(event.data.user.id, event.data.user.username);
    }
}
```

## 🌐 Production Deployment

### Option 1: Cloud Hosting
Deploy your server to:
- **Heroku**: Easy deployment with Git
- **Vercel**: Serverless functions
- **Railway**: Simple Node.js hosting
- **DigitalOcean**: Full control

### Option 2: Update Webhook URL
Once deployed, update your webhook URL in Whop dashboard:
```
https://your-domain.com/webhook/whop
```

## 🛠️ Troubleshooting

### Common Issues

1. **Webhook not receiving events**
   - Check ngrok is running
   - Verify webhook URL in Whop dashboard
   - Check server logs for errors

2. **Greeting not sent**
   - Check if user already greeted (prevents duplicates)
   - Verify webhook secret configuration
   - Check server console for errors

3. **ngrok URL changes**
   - ngrok URLs change on restart
   - Update webhook URL in Whop dashboard
   - Consider ngrok paid plan for static URLs

### Debug Commands
```bash
# Check if server is running
curl http://localhost:3000/api/preview-info

# Test webhook endpoint
curl -X POST http://localhost:3000/webhook/whop \
  -H "Content-Type: application/json" \
  -d '{"type":"test","data":{}}'

# Check webhook status
curl http://localhost:3000/webhook/status
```

## 📱 Testing with Real Users

### Step-by-Step Process
1. **Start ngrok**: `ngrok http 3000`
2. **Update webhook URL** in Whop dashboard
3. **Share your Whop link** with testers
4. **Monitor server logs** for real events
5. **Verify greeting messages** are sent
6. **Test different scenarios** (join, message, experience entry)

### What Testers Will See
- **Join your Whop community** via your link
- **Receive greeting message** automatically
- **Access your React Native app** in development mode
- **Test all features** without app store deployment

## 🎯 Success Criteria
- ✅ Webhook receives real join events
- ✅ Greeting messages sent automatically
- ✅ No duplicate greetings to same user
- ✅ All events logged properly
- ✅ Server handles multiple users
- ✅ Error handling works correctly

## 📞 Support
- **Whop Documentation**: https://dev.whop.com
- **Developer Discord**: https://discord.gg/xrgfRnVHgV
- **GitHub Issues**: https://github.com/whopio/whop-sdk-ts/issues
