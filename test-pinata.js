const pinataSDK = require('@pinata/sdk');
require('dotenv').config();

async function testPinata() {
    try {
        const pinata = new pinataSDK(
            process.env.PINATA_API_KEY,
            process.env.PINATA_SECRET_KEY
        );
        
        const result = await pinata.testAuthentication();
        console.log('Pinata authentication successful:', result);
    } catch (error) {
        console.error('Pinata authentication failed:', error.message);
    }
}

testPinata();