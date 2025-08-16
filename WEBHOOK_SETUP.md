# 🔐 Webhook Secret Setup Guide

## Where to Get Your Webhook Secret

### 1. **Whop Developer Dashboard**
1. Go to [Whop Developer Dashboard](https://whop.com/dashboard/developer)
2. Find your app: `app_FInBMCJGyVdD9T`
3. Look for **"Webhook Settings"** or **"API Configuration"**
4. You should see a **"Webhook Secret"** or **"Signing Secret"** field

### 2. **If No Secret is Shown**
If you don't see a webhook secret in your dashboard:
- **Generate your own secret**: Use a secure random string
- **Recommended format**: 32+ character random string
- **Example**: `whop_webhook_secret_abc123xyz789def456`

### 3. **Generate a Secure Secret**
You can generate a secure webhook secret using:
```bash
# Generate a random 32-character secret
openssl rand -hex 32

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 🔧 Setting Up Webhook Secret

### Option 1: Add to Vercel Environment Variables
```bash
# Add webhook secret to Vercel
vercel env add WHOP_WEBHOOK_SECRET
# Enter your secret when prompted
```

### Option 2: Add to Local Environment
Add to your `.env.local` file:
```env
WHOP_WEBHOOK_SECRET=your_webhook_secret_here
```

### Option 3: Use Default Secret
If you don't have a specific secret, you can use a default one:
```env
WHOP_WEBHOOK_SECRET=whop_webhook_secret_default_2024
```

## 📡 Configure Webhook URL in Whop Dashboard

### 1. **Go to Developer Dashboard**
- Visit: https://whop.com/dashboard/developer
- Find your app: `app_FInBMCJGyVdD9T`

### 2. **Set Webhook URL**
- Look for **"Webhook URL"** or **"Webhook Endpoint"**
- Set it to: `https://whop-react-native-j4asbljgr-michaelrobotics-projects.vercel.app/webhook/whop`

### 3. **Set Webhook Secret** (if available)
- Enter the same secret you used in your environment variables
- This ensures webhook signature verification

## 🧪 Testing Your Webhook

### Local Testing (Working ✅)
- **URL**: http://localhost:3000/webhook-test
- **Status**: ✅ Working
- **Features**: Test all webhook events locally

### Production Testing
- **URL**: https://whop-react-native-j4asbljgr-michaelrobotics-projects.vercel.app/webhook-test
- **Status**: Ready for real events
- **Features**: Handle real Whop webhook events

## 🔍 Webhook Event Types

Your webhook handles these events:
- `user.joined_community` - Triggers greeting message
- `user.sent_message` - Logs user messages  
- `user.entered_experience` - Tracks experience usage

## 🚀 Next Steps

1. **Get webhook secret** from Whop dashboard
2. **Add secret to Vercel**: `vercel env add WHOP_WEBHOOK_SECRET`
3. **Configure webhook URL** in Whop dashboard
4. **Test with real users** by sharing your Whop link
5. **Monitor webhook events** in Vercel logs

## 📞 Support

- **Whop Documentation**: https://dev.whop.com
- **Developer Discord**: https://discord.gg/xrgfRnVHgV
- **Vercel Dashboard**: https://vercel.com/dashboard
