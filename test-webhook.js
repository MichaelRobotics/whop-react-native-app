const { sendWelcomeMessage } = require('./src/services/messaging-service.js');

// Test the welcome message functionality
async function testWelcomeMessage() {
    console.log('Testing welcome message functionality...');
    
    try {
        const result = await sendWelcomeMessage('test-user-123', 'TestUser');
        console.log('Test result:', result);
    } catch (error) {
        console.error('Test failed:', error.message);
    }
}

// Run the test
testWelcomeMessage();
