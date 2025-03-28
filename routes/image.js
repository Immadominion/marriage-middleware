const express = require('express');
const router = express.Router();
const generateMarriageCertificate = require('../utils/generateImage');
const pinataSDK = require('@pinata/sdk');
const fs = require('fs'); 
const path = require('path');
require('dotenv').config();

const pinata = new pinataSDK(
    process.env.PINATA_API_KEY,
    process.env.PINATA_SECRET_KEY
);

router.get('/certificate/:id', async (req, res) => {
    const tempFilePath = path.join(__dirname, `../temp-${req.params.id}.jpg`);
    
    try {
        const certificateData = {
            husbandName: req.query.husband || "John Doe",
            wifeName: req.query.wife || "Jane Doe",
            date: req.query.date || "February 27, 2025",
            certificateNumber: req.params.id
        };

        console.log('Generating certificate with data:', certificateData);
        const imageBuffer = await generateMarriageCertificate(certificateData);

        if (!Buffer.isBuffer(imageBuffer)) {
            throw new Error("Image generation failed: Not a valid Buffer.");
        }

        // Write buffer to file
        await fs.promises.writeFile(tempFilePath, imageBuffer);

        // Define options for pinata upload
        const options = {
            pinataMetadata: {
                name: `Marriage-Certificate-${req.params.id}`
            }
        };

        // Use the Pinata SDK to pin a file from path
        // This is simpler than trying to create a FormData object
        const result = await pinata.pinFromFS(tempFilePath, options);
        console.log('IPFS upload successful:', result);

        // Return response
        res.json({
            image: `data:image/jpeg;base64,${imageBuffer.toString('base64')}`,
            ipfsUrl: `ipfs://${result.IpfsHash}`,
            httpUrl: `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`,
            publicGatewayUrl: `https://ipfs.io/ipfs/${result.IpfsHash}`
        });

    } catch (error) {
        console.error('Detailed error:', error);
        res.status(500).json({ 
            error: error.message || "Unknown error",
            stack: error.stack || "No stack available"
        });
    } finally {
        // Clean up temp file
        try {
            if (fs.existsSync(tempFilePath)) {
                fs.unlinkSync(tempFilePath);
            }
        } catch (cleanupError) {
            console.error('Error cleaning up temp file:', cleanupError);
        }
    }
});

module.exports = router;