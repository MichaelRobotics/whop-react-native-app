const https = require('https');

console.log('Testing webhook endpoint accessibility...');

const options = {
    hostname: 'whop-react-native-gem1swz6o-michaelrobotics-projects.vercel.app',
    port: 443,
    path: '/webhook',
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
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
        console.log('Response:', data.substring(0, 200) + '...');
    });
});

req.on('error', (e) => {
    console.error(`Problem with request: ${e.message}`);
});

req.end();
