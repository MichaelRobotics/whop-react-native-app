# React Native App (Beta)

A React Native app built with the Whop SDK for creating mobile experiences.

## 🚀 Getting Started

### Prerequisites

- Node.js 22+ 
- pnpm 9.15+
- A Whop app created in the [developer dashboard](https://whop.com/dashboard/developer)

### Setup

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Configure environment variables:**
   Create a `.env.local` file with your Whop app credentials:
   ```env
   WHOP_APP_ID=your_app_id
   WHOP_APP_SECRET=your_app_secret
   WHOP_WEBHOOK_SECRET=your_webhook_secret
   ```

3. **Build and ship your app:**
   ```bash
   pnpm ship
   ```

## 📱 App Structure

- **Experience View** (`src/views/experience-view.tsx`): Main view shown when users access your app
- **Discover View** (`src/views/discover-view.tsx`): View shown when users discover your app

## 🛠️ Available Commands

- `pnpm build` - Build your app
- `pnpm upload` - Upload to Whop
- `pnpm clean` - Clean build files
- `pnpm ship` - Build and upload in one command

## 🔧 Development

### Testing on Device

1. Install your app into your Whop
2. Open the app from inside your Whop on your phone
3. **iOS**: Shake the device to enable dev mode
4. **Android**: Use the info button in the top right to toggle developer mode

### Testing Webhooks Without App Store

#### Method 1: Development Environment Testing
1. **Deploy to Development**: Use `pnpm ship` (already done)
2. **Configure Webhook URL**: In your Whop developer dashboard, set webhook URL to your local server
3. **Use ngrok for Public URL**: 
   ```bash
   # Install ngrok
   npm install -g ngrok
   
   # Create public tunnel to your local server
   ngrok http 3000
   ```
4. **Update Webhook URL**: Use the ngrok URL (e.g., `https://abc123.ngrok.io/webhook/whop`)
5. **Test with Real Users**: Share your Whop link with specific people for testing

#### Method 2: Local Testing Interface
- Visit `http://localhost:3000/webhook-test`
- Simulate all webhook events
- Test greeting functionality with custom data

#### Method 3: Direct API Testing
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
```

### Native Integration

The app supports these native libraries:
- `react-native-nitro-modules@0.26.3`
- `react-native-video@6.16.1`
- `@d11/react-native-fast-image@8.10.0`
- `react-native-svg@15.12.0`
- `react-native-webview@13.15.0`
- `react-native-reanimated@3.18.0`
- `react-native-gesture-handler@2.27.2`
- `react-native-haptic-feedback@2.3.3`

## 🚀 Deployment

1. **Development Build:**
   ```bash
   pnpm ship
   ```

2. **Production Deployment:**
   - Go to your [developer dashboard](https://whop.com/dashboard/developer)
   - Click "Promote to production" on your latest development build
   - After automated review, the app will be pushed to all users

## 📚 Documentation

- [Whop React Native Documentation](https://dev.whop.com/tutorials/react-native)
- [Whop API Reference](https://dev.whop.com/api-reference)

## ⚠️ Beta Notice

The React Native SDK is still in beta. We're actively working to improve and fix any bugs. Currently, the [Whop courses](https://whop.com/apps/app_0vPZThfBpAwLo/) app is fully powered by React Native on both iOS and Android.

## 🆘 Support

- [Developer Discord](https://discord.gg/xrgfRnVHgV)
- [Documentation](https://dev.whop.com)
- [GitHub Issues](https://github.com/whopio/whop-sdk-ts/issues)
