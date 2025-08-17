#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Starting mobile build...');

// Create dist directory if it doesn't exist
const distDir = path.join(__dirname, '..', 'dist');
const srcDir = path.join(__dirname, '..', 'src');

if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
}

// Copy source files to dist
function copyDirectory(src, dest) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }
    
    const files = fs.readdirSync(src);
    
    files.forEach(file => {
        const srcPath = path.join(src, file);
        const destPath = path.join(dest, file);
        
        if (fs.statSync(srcPath).isDirectory()) {
            copyDirectory(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    });
}

// Copy source files
console.log('📁 Copying source files...');
copyDirectory(srcDir, path.join(distDir, 'src'));

// Copy package.json
console.log('📦 Copying package.json...');
const packageJson = require('../package.json');
fs.writeFileSync(
    path.join(distDir, 'package.json'),
    JSON.stringify(packageJson, null, 2)
);

// Create app manifest
console.log('📋 Creating app manifest...');
const appManifest = {
    name: "Whop Chat App",
    version: "1.0.0",
    platforms: ["android", "ios", "web"],
    entryPoints: {
        android: "./src/App.js",
        ios: "./src/App.js",
        web: "./src/App.js"
    },
    dependencies: packageJson.dependencies,
    buildTime: new Date().toISOString()
};

fs.writeFileSync(
    path.join(distDir, 'app-manifest.json'),
    JSON.stringify(appManifest, null, 2)
);

// Create build info
console.log('📊 Creating build info...');
const buildInfo = {
    buildTime: new Date().toISOString(),
    version: "1.0.0",
    platform: "react-native",
    environment: process.env.NODE_ENV || 'development'
};

fs.writeFileSync(
    path.join(distDir, 'build-info.json'),
    JSON.stringify(buildInfo, null, 2)
);

console.log('✅ Mobile build completed successfully!');
console.log('📱 Build output directory:', distDir);
console.log('📦 Ready for deployment to Whop mobile app');
