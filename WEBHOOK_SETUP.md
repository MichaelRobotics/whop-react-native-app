# Webhook Setup Guide

This guide will help you set up webhooks for your Whop app to automatically send welcome messages when users join.

## ✅ Current Status

**Webhook is now fully functional and deployed!**

- **Webhook URL**: `https://whop-react-native-app.vercel.app/api/webhook`
- **Status**: ✅ Active and sending messages
- **Events**: `membership_went_valid`, `membership_experience_claimed`, `app_payment_succeeded`

## 🔧 Setup Instructions

### 1. Configure Webhook in Whop Dashboard

1. Go to your **Whop App Dashboard**
2. Navigate to **Webhooks** section
3. Click **Add Webhook** or **Create Webhook**
4. Set the following configuration:

```
Webhook URL: https://whop-react-native-app.vercel.app/api/webhook
Webhook Secret: ws_ca76a75da35c7f8271455638e8fea03b8acd42ef00ceab9b4fc037f3bb284fa7
```

### 2. Select Webhook Events

Enable these specific events:

- ✅ `membership_went_valid` - Triggers when a user's membership becomes valid (including free plans)
- ✅ `membership_experience_claimed` - Triggers when a user claims their membership experience
- ✅ `app_payment_succeeded` - Triggers when a payment is successfully processed

### 3. Environment Variables

Make sure these environment variables are set in your Vercel deployment:

```
WHOP_API_KEY=your_api_key_here
WHOP_WEBHOOK_SECRET=ws_ca76a75da35c7f8271455638e8fea03b8acd42ef00ceab9b4fc037f3bb284fa7
NEXT_PUBLIC_WHOP_APP_ID=your_app_id_here
NEXT_PUBLIC_WHOP_AGENT_USER_ID=your_agent_user_id_here
NEXT_PUBLIC_WHOP_COMPANY_ID=your_company_id_here
```

## 🎯 What Happens When Users Join

### Free Plan Users
When a user joins with a free plan:
1. **Event**: `membership_went_valid` is triggered
2. **Action**: Welcome message is automatically sent
3. **Message**: "🎉 Welcome to our community, [username]! Thank you for joining us..."

### Paid Plan Users
When a user purchases a paid plan:
1. **Event**: `app_payment_succeeded` is triggered
2. **Action**: Payment confirmation message is sent
3. **Message**: "✅ Payment Confirmed, [username]! Your payment has been processed successfully..."

### Experience Claimed
When a user claims their membership:
1. **Event**: `membership_experience_claimed` is triggered
2. **Action**: Welcome message is sent
3. **Message**: "🎉 Welcome to our community, [username]! Thank you for claiming your membership..."

## 🔍 Testing

### Test with Free Plan
1. Join your whop with a free plan
2. Check if you receive a welcome message
3. Monitor webhook logs in Vercel dashboard

### Test with Paid Plan
1. Purchase a plan in your whop
2. Check if you receive a payment confirmation message
3. Monitor webhook logs in Vercel dashboard

## 📊 Monitoring

### Vercel Logs
- Go to your Vercel dashboard
- Navigate to your project
- Check **Functions** → **api/webhook** for logs

### Webhook Status
- Check webhook delivery status in Whop dashboard
- Monitor for any failed deliveries
- Verify signature verification is working

## 🚨 Troubleshooting

### Webhook Not Triggering
1. Verify webhook URL is correct: `https://whop-react-native-app.vercel.app/api/webhook`
2. Check that events are enabled in Whop dashboard
3. Ensure webhook secret is set correctly
4. Monitor Vercel logs for errors

### Messages Not Sending
1. Verify all environment variables are set in Vercel
2. Check that `@whop/api` dependency is installed
3. Monitor webhook logs for SDK errors
4. Verify agent user ID has messaging permissions

### 401 Authentication Error
- This was fixed by using the main domain instead of subdomain
- Current URL works: `https://whop-react-native-app.vercel.app/api/webhook`

## 🎉 Success!

Your webhook is now fully configured and will automatically send welcome messages to new users joining your whop, whether they're on free or paid plans!
