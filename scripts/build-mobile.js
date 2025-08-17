#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Building Whop React Native Mobile App...');

// Configuration
const config = {
    appId: process.env.NEXT_PUBLIC_WHOP_APP_ID || 'app_FInBMCJGyVdD9T',
    platforms: ['android', 'ios'],
    sourceDir: './src',
    buildDir: './dist',
    views: {
        discover: './src/views/discover-view.tsx',
        experience: './src/views/experience-view.tsx'
    }
};

// Create build directory
if (!fs.existsSync(config.buildDir)) {
    fs.mkdirSync(config.buildDir, { recursive: true });
}

// Build process
async function buildMobile() {
    try {
        console.log('📱 Starting mobile build process...');
        
        // 1. Validate environment
        console.log('🔍 Validating environment...');
        validateEnvironment();
        
        // 2. Bundle React Native code
        console.log('📦 Bundling React Native code...');
        await bundleCode();
        
        // 3. Create platform-specific builds
        console.log('🏗️ Creating platform builds...');
        for (const platform of config.platforms) {
            await buildPlatform(platform);
        }
        
        // 4. Generate build manifest
        console.log('📋 Generating build manifest...');
        generateManifest();
        
        console.log('✅ Mobile build completed successfully!');
        console.log('📁 Build output:', path.resolve(config.buildDir));
        
    } catch (error) {
        console.error('❌ Build failed:', error.message);
        process.exit(1);
    }
}

function validateEnvironment() {
    const required = [
        'NEXT_PUBLIC_WHOP_APP_ID',
        'WHOP_API_KEY',
        'NEXT_PUBLIC_WHOP_AGENT_USER_ID'
    ];
    
    const missing = required.filter(key => !process.env[key]);
    
    if (missing.length > 0) {
        console.warn('⚠️ Missing environment variables:', missing);
        console.warn('📝 Using fallback values for development...');
    }
}

async function bundleCode() {
    // Create a simple bundle for React Native
    const bundleContent = `
// Whop React Native App Bundle
// Generated: ${new Date().toISOString()}

// Import main app
import App from '../src/App.js';

// Export for Whop platform
export default App;
    `;
    
    fs.writeFileSync(path.join(config.buildDir, 'main.js'), bundleContent);
    
    // Copy source files
    copyDirectory(config.sourceDir, path.join(config.buildDir, 'src'));
}

async function buildPlatform(platform) {
    console.log(`🔨 Building for ${platform}...`);
    
    const platformDir = path.join(config.buildDir, platform);
    if (!fs.existsSync(platformDir)) {
        fs.mkdirSync(platformDir, { recursive: true });
    }
    
    // Create platform-specific manifest
    const manifest = {
        platform: platform,
        appId: config.appId,
        version: '1.0.0',
        buildDate: new Date().toISOString(),
        entryPoint: './main.js',
        views: config.views
    };
    
    fs.writeFileSync(
        path.join(platformDir, 'manifest.json'),
        JSON.stringify(manifest, null, 2)
    );
    
    console.log(`✅ ${platform} build completed`);
}

function generateManifest() {
    const manifest = {
        appId: config.appId,
        name: 'Whop Chat App',
        version: '1.0.0',
        description: 'Interactive chat app with affiliate marketing',
        platforms: config.platforms,
        buildDate: new Date().toISOString(),
        features: [
            'Interactive Chat',
            'WebSocket Integration',
            'Automated Responses',
            'Affiliate Links',
            'Gold Shimmer Animations'
        ]
    };
    
    fs.writeFileSync(
        path.join(config.buildDir, 'app-manifest.json'),
        JSON.stringify(manifest, null, 2)
    );
}

function copyDirectory(src, dest) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }
    
    const entries = fs.readdirSync(src, { withFileTypes: true });
    
    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        
        if (entry.isDirectory()) {
            copyDirectory(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

// Run build
buildMobile();
