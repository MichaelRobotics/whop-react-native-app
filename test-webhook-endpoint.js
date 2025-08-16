const crypto = require('crypto');

// Test webhook endpoint
const WEBHOOK_URL = 'https://whop-react-native-gem1swz6o-michaelrobotics-projects.vercel.app/webhook';
const WEBHOOK_SECRET = 'ws_ca76a75da35c7f8271455638e8fea03b8acd42ef00ceab9b4fc037f3bb284fa7';

// Test payload
const testPayload = {
    event: 'app_payment_succeeded',
    data: {
        user: {
            id: 'user_test123',
            username: 'TestUser'
        },
        amount: 9.99,
        payment: {
            id: 'pay_test123',
            amount: 9.99
        }
    }
};

// Create signature
const payload = JSON.stringify(testPayload);
const signature = crypto
    .createHmac('sha256', WEBHOOK_SECRET)
    .update(payload, 'utf8')
    .digest('hex');

console.log('Testing webhook endpoint...');
console.log('URL:', WEBHOOK_URL);
console.log('Payload:', payload);
console.log('Signature:', signature);

// Make the request
const https = require('https');

const postData = payload;

const options = {
    hostname: 'whop-react-native-gem1swz6o-michaelrobotics-projects.vercel.app',
    port: 443,
    path: '/webhook',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'x-whop-signature': signature
    }
};

const req = https.request(options, (res) => {
    console.log(`Status: ${res.statusCode}`);
    console.log(`Headers: ${JSON.stringify(res.headers)}`);
    
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    
    res.on('end', () => {
        console.log('Response:', data);
    });
});

req.on('error', (e) => {
    console.error(`Problem with request: ${e.message}`);
});

req.write(postData);
req.end();
