require('dotenv').config();
const axios = require('axios');
const mongoose = require('mongoose');
const ShareLink = require('./models/ShareLink');
const connectDB = require('./db');

async function testShareUrl() {
    try {
        // Connect to the database
        await connectDB();
        
        console.log('Step 1: Testing creating a share URL');
        // Test creating a share URL
        const createShareResponse = await axios.post('http://localhost:3000/share/create', {
            firstPartnerAddress: '0x123456789abcdef',
            firstPartnerName: 'Jake',
            secondPartnerName: 'Shawty',
            nftId: 2025001
        });

        if (createShareResponse.data.success) {
            console.log('✅ Share URL created successfully!');
            console.log('Share URL:', createShareResponse.data.shareUrl);
            console.log('Share Code:', createShareResponse.data.shareCode);
            
            console.log('\nStep 2: Testing validating the share URL');
            const validateShareResponse = await axios.get(
                `http://localhost:3000/share/${createShareResponse.data.shareCode}`
            );
            
            if (validateShareResponse.data.success) {
                console.log('✅ Share URL validated successfully!');
                console.log('Share data:', validateShareResponse.data.shareLink);
                
                console.log('\nStep 3: Testing claiming the share URL');
                const claimShareResponse = await axios.post(
                    `http://localhost:3000/share/${createShareResponse.data.shareCode}/claim`,
                    {
                        secondPartnerAddress: '0xabcdef123456789'
                    }
                );
                
                if (claimShareResponse.data.success) {
                    console.log('✅ Share URL claimed successfully!');
                    console.log('Claim data:', claimShareResponse.data);
                    console.log('\nAll tests passed! Your sharing URL system is working correctly.');
                } else {
                    console.error('❌ Failed to claim share URL:', claimShareResponse.data.error);
                }
            } else {
                console.error('❌ Failed to validate share URL:', validateShareResponse.data.error);
            }
        } else {
            console.error('❌ Failed to create share URL:', createShareResponse.data.error);
        }
    } catch (error) {
        console.error('❌ Test error:', error.message);
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
        }
        process.exit(1);
    } finally {
        // Close database connection
        try {
            await mongoose.disconnect();
            console.log('Database connection closed');
        } catch (err) {
            console.error('Error closing database connection:', err);
        }
    }
}

// Execute the test
console.log('Starting share URL tests...');
testShareUrl();