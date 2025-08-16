# Webhook Setup Guide for Automatic Welcome Messages

This guide explains how to set up automatic welcome messages when users purchase your whop.

## Prerequisites

1. **Whop Developer Account**: You need a Whop developer account with an app created
2. **Server with HTTPS**: Your webhook endpoint must be accessible via HTTPS
3. **Environment Variables**: Configure the required environment variables

## Step 1: Configure Environment Variables

Copy the `env.example` file to `.env` and fill in your credentials:

```bash
cp env.example .env
```

Update the `.env` file with your actual Whop credentials:

```env
# Whop App Configuration
WHOP_API_KEY=your_whop_api_key_here
NEXT_PUBLIC_WHOP_APP_ID=your_whop_app_id_here
NEXT_PUBLIC_WHOP_AGENT_USER_ID=your_agent_user_id_here
NEXT_PUBLIC_WHOP_COMPANY_ID=your_company_id_here

# Webhook Configuration
WHOP_WEBHOOK_SECRET=ws_ca76a75da35c7f8271455638e8fea03b8acd42ef00ceab9b4fc037f3bb284fa7

# Server Configuration
PORT=3000
NODE_ENV=development
```

## Step 2: Deploy Your Server

Deploy your server to a platform that supports HTTPS (required for webhooks):

### Option A: Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

### Option B: Heroku
1. Create a Heroku app
2. Set environment variables: `heroku config:set WHOP_APP_ID=your_app_id`
3. Deploy: `git push heroku main`

### Option C: Railway
1. Connect your GitHub repository
2. Set environment variables in Railway dashboard
3. Deploy automatically

## Step 3: Set Up Webhook in Whop Dashboard

1. **Go to Whop Developer Dashboard**: https://whop.com/dashboard/developer
2. **Select Your App**: Choose the app you want to configure webhooks for
3. **Navigate to Webhooks**: Find the webhooks section in your app settings
4. **Create Webhook**:
   - **Webhook URL**: `https://your-domain.com/webhook`
   - **Events**: Select the events you want to listen for:
     - `app_payment_succeeded` or `payment_succeeded` (when payment is successful)
     - `membership_went_valid` or `app_membership_went_valid` (when membership becomes valid)
     - `membership_experience_claimed` (when user claims membership experience)
5. **Save Configuration**: The webhook will be created with a unique URL that includes authentication

## Step 4: Test Your Webhook

1. **Start your server locally** (for testing):
   ```bash
   npm start
   ```

2. **Use ngrok for local testing**:
   ```bash
   npx ngrok http 3000
   ```

3. **Update webhook URL** in Whop dashboard with the ngrok URL

4. **Test the webhook** by triggering the events in your whop

## Step 5: Monitor Webhook Events

Your server will log webhook events. Check the console for:
- Webhook received events
- User join events
- Welcome message sending status

## Troubleshooting

### Common Issues:

1. **Webhook not receiving events**:
   - Check if your server is accessible via HTTPS
   - Verify the webhook URL is correct
   - Check server logs for errors

2. **Welcome messages not sending**:
   - Verify `WHOP_API_KEY` is correct
   - Check if the user ID is valid
   - Review error logs

3. **Authentication errors**:
   - Ensure your app credentials are correct
   - Check if your app has messaging permissions

### Debug Mode:

Enable debug logging by setting:
```env
NODE_ENV=development
```

## Security Notes

- Webhook URLs include authentication tokens - keep them secure
- Never log sensitive user data
- Use HTTPS for all webhook endpoints
- Validate webhook data before processing

## Next Steps

After setting up webhooks, you can:

1. **Customize welcome messages** in `src/services/messaging-service.js`
2. **Add more event handlers** in `preview-server.js`
3. **Implement retry logic** for failed message sends
4. **Add analytics** to track welcome message effectiveness
