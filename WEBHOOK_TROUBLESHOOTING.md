# 🔧 Webhook Troubleshooting Guide

## Problem: Customer Didn't Receive Greeting Message

When a real user joins your Whop community but doesn't receive the greeting message, here's how to troubleshoot:

## 🔍 **Step-by-Step Troubleshooting**

### **Step 1: Check Webhook Configuration in Whop Dashboard**

1. **Go to Whop Developer Dashboard**: https://whop.com/dashboard/developer
2. **Find your app**: `app_FInBMCJGyVdD9T`
3. **Look for Webhook Settings**:
   - Webhook URL should be set
   - Webhook secret should be configured
   - Webhook should be enabled

### **Step 2: Verify Webhook URL**

**Current Webhook URLs:**
- **Vercel (with auth)**: `https://whop-react-native-in4i2hkyt-michaelrobotics-projects.vercel.app/webhook/whop`
- **Local (for testing)**: `http://localhost:3000/webhook/whop`

**Issue**: Vercel requires authentication, so Whop can't reach it.

### **Step 3: Test Webhook Endpoints**

#### **Local Testing (Working ✅)**
```bash
# Test local webhook
curl -X POST http://localhost:3000/webhook/whop \
  -H "Content-Type: application/json" \
  -d '{"type":"user.joined_community","data":{"user":{"id":"customer_test","username":"customer","name":"Customer"}}}'

# Check status
curl http://localhost:3000/webhook/status
```

#### **Production Testing (Blocked by Auth)**
```bash
# This will fail due to Vercel authentication
curl -X POST https://whop-react-native-in4i2hkyt-michaelrobotics-projects.vercel.app/webhook/whop \
  -H "Content-Type: application/json" \
  -d '{"type":"test","data":{}}'
```

## 🚀 **Solutions**

### **Solution 1: Use Railway (Recommended)**

Railway doesn't have authentication requirements:

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

### **Solution 2: Use ngrok for Testing**

Create a public tunnel to your local server:

```bash
# Install ngrok
sudo snap install ngrok

# Create tunnel
ngrok http 3000

# Use the ngrok URL in Whop dashboard
# Example: https://abc123.ngrok.io/webhook/whop
```

### **Solution 3: Disable Vercel Authentication**

1. Go to Vercel Dashboard
2. Find your project
3. Go to Settings → Security
4. Disable "Password Protection"

## 📊 **Current Status**

### **✅ Working Components**
- **Local webhook**: ✅ Processing events correctly
- **Greeting logic**: ✅ Sending messages
- **User tracking**: ✅ Preventing duplicates
- **Environment variables**: ✅ Synced

### **❌ Blocking Issues**
- **Vercel authentication**: ❌ Blocking webhook calls
- **Webhook URL**: ❌ Not accessible to Whop

## 🎯 **Immediate Fix**

### **Option A: Quick Test with ngrok**
```bash
# Start ngrok
ngrok http 3000

# Copy the HTTPS URL (e.g., https://abc123.ngrok.io)
# Update webhook URL in Whop dashboard to: https://abc123.ngrok.io/webhook/whop
```

### **Option B: Deploy to Railway**
```bash
# Deploy to Railway
railway login
railway init
railway up

# Use the Railway URL in Whop dashboard
```

## 🔧 **Webhook Configuration Checklist**

### **In Whop Dashboard:**
- [ ] Webhook URL is set correctly
- [ ] Webhook secret matches your environment
- [ ] Webhook is enabled
- [ ] Events are being sent (check logs)

### **In Your Server:**
- [ ] Webhook endpoint is accessible
- [ ] No authentication blocking requests
- [ ] Environment variables are set
- [ ] Greeting logic is working

## 📝 **Testing Steps**

1. **Configure webhook URL** in Whop dashboard
2. **Send test event** using the testing interface
3. **Check server logs** for incoming events
4. **Verify greeting message** is sent
5. **Test with real user** joining community

## 🆘 **Debug Commands**

```bash
# Check local webhook status
curl http://localhost:3000/webhook/status

# Test webhook locally
curl -X POST http://localhost:3000/webhook/whop \
  -H "Content-Type: application/json" \
  -d '{"type":"user.joined_community","data":{"user":{"id":"test","username":"testuser"}}}'

# Check server logs
tail -f /var/log/your-server.log
```

## 🎉 **Expected Result**

When working correctly:
1. **User joins** your Whop community
2. **Whop sends webhook** to your server
3. **Server processes event** and sends greeting
4. **User receives message**: "👋 Welcome to our community, [username]! We're excited to have you here! 🎉"

## 📞 **Next Steps**

1. **Choose deployment option** (Railway recommended)
2. **Update webhook URL** in Whop dashboard
3. **Test with another user**
4. **Monitor webhook events** in server logs
