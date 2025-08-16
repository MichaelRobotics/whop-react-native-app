const https = require('https');
const crypto = require('crypto');

// Test webhook with membership.went_valid event
const testWebhook = async () => {
    const webhookUrl = 'https://whop-react-native-app.vercel.app/api/webhook';
    const webhookSecret = process.env.WHOP_WEBHOOK_SECRET || 'test-secret';
    
    // Test payload for membership.went_valid event
    const payload = {
        "data": {
            "id": "mem_test123",
            "product_id": "prod_test123",
            "user": {
                "id": "user_L8YwhuixVcRCf",
                "username": "testuser"
            },
            "user_id": "user_L8YwhuixVcRCf",
            "plan_id": "plan_test123",
            "page_id": "biz_test123",
            "created_at": Math.floor(Date.now() / 1000),
            "expires_at": null,
            "renewal_period_start": null,
            "renewal_period_end": null,
            "quantity": 1,
            "status": "completed",
            "valid": true,
            "cancel_at_period_end": false,
            "license_key": "TEST-1234-5678",
            "metadata": {},
            "checkout_id": "test_checkout_123",
            "affiliate_username": "testaffiliate",
            "manage_url": "https://whop.com/orders/mem_test123/manage/",
            "company_buyer_id": null,
            "marketplace": false,
            "acquisition_data": {},
            "custom_field_responses": [],
            "entry_custom_field_responses": [],
            "status_reason": "created"
        },
        "api_version": "v5",
        "action": "membership.went_valid"
    };

    const postData = JSON.stringify(payload);
    
    // Generate signature
    const timestamp = Math.floor(Date.now() / 1000);
    const signature = crypto
        .createHmac('sha256', webhookSecret)
        .update(postData, 'utf8')
        .digest('hex');
    
    const signatureHeader = `t=${timestamp},v1=${signature}`;

    const options = {
        hostname: 'whop-react-native-app.vercel.app',
        port: 443,
        path: '/api/webhook',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData),
            'x-whop-signature': signatureHeader
        }
    };

    console.log('🧪 Testing webhook with membership.went_valid event...');
    console.log('   URL:', webhookUrl);
    console.log('   Payload:', JSON.stringify(payload, null, 2));
    console.log('   Signature:', signatureHeader);

    const req = https.request(options, (res) => {
        console.log(`Status: ${res.statusCode}`);
        console.log('Headers:', JSON.stringify(res.headers, null, 2));

        let data = '';
        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            console.log('Response:', data);
            if (res.statusCode === 200) {
                console.log('✅ Webhook test successful!');
            } else {
                console.log('❌ Webhook test failed!');
            }
        });
    });

    req.on('error', (e) => {
        console.error(`Problem with request: ${e.message}`);
    });

    req.write(postData);
    req.end();
};

// Run the test
testWebhook();
