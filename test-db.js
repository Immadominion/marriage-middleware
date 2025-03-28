// test-db.js
const connectDB = require('./db');
const ShareLink = require('./models/ShareLink');

async function testDB() {
  try {
    // Connect to the database
    await connectDB();
    
    // Create a test document
    const testLink = new ShareLink({
      shareCode: 'test-' + Date.now(),
      firstPartnerAddress: '0xtest123',
      firstPartnerName: 'Test User',
      secondPartnerName: 'Test Partner',
      nftId: 'test-nft-001'
    });
    
    // Save to database
    await testLink.save();
    console.log('Test document created:', testLink);
    
    // Find the document
    const foundLink = await ShareLink.findOne({ shareCode: testLink.shareCode });
    console.log('Found document:', foundLink);
    
    // Delete the test document
    await ShareLink.deleteOne({ _id: testLink._id });
    console.log('Test document deleted');
    
    console.log('Database test completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Database test failed:', error);
    process.exit(1);
  }
}

testDB();