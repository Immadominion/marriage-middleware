const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const ShareLink = require('../models/ShareLink');
require('dotenv').config();

// Generate a new sharing link when first partner mints
router.post('/create', async (req, res) => {
    try {
        const { firstPartnerAddress, firstPartnerName, secondPartnerName, nftId } = req.body;
        
        // Generate a unique sharing code
        const shareCode = crypto.randomBytes(8).toString('hex');
        
        // Store the link details in database
        const shareLink = await ShareLink.create({
            shareCode,
            firstPartnerAddress,
            firstPartnerName,
            secondPartnerName,
            nftId,
            created: new Date(),
            claimed: false
        });
        
        // Clean up base URLs and create sharing URL
        const frontendUrl = process.env.FRONTEND_URL.replace(/\/$/, '');
        const baseUrl = process.env.BASE_URL.replace(/\/$/, '');
        const shareUrl = `${frontendUrl}/join-marriage/${shareCode}`;
        
        res.json({ 
            success: true, 
            shareUrl,
            shareCode,
            previewUrl: `${process.env.BASE_URL}/images/certificate/${nftId}`
        });
    } catch (error) {
        console.error('Error creating share link:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Validate a sharing link when second partner accesses it
router.get('/:shareCode', async (req, res) => {
    try {
        const { shareCode } = req.params;
        
        // Look up the sharing link
        const shareLink = await ShareLink.findOne({ shareCode });
        
        if (!shareLink) {
            return res.status(404).json({ 
                success: false, 
                error: 'Invalid or expired marriage link' 
            });
        }
        
        if (shareLink.claimed) {
            return res.status(400).json({ 
                success: false, 
                error: 'This marriage certificate has already been claimed' 
            });
        }
        
        // Return the necessary data for the frontend
        res.json({
            success: true,
            shareLink: {
                firstPartnerName: shareLink.firstPartnerName,
                secondPartnerName: shareLink.secondPartnerName,
                nftId: shareLink.nftId,
                createdDate: shareLink.created
            },
            previewUrl: `${process.env.BASE_URL}/images/certificate/${shareLink.nftId}`
        });
    } catch (error) {
        console.error('Error validating share link:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Claim a share link (when second partner mints)
router.post('/:shareCode/claim', async (req, res) => {
    try {
        const { shareCode } = req.params;
        const { secondPartnerAddress } = req.body;
        
        // Look up and update the sharing link
        const shareLink = await ShareLink.findOneAndUpdate(
            { shareCode, claimed: false },
            { claimed: true, secondPartnerAddress, claimedDate: new Date() },
            { new: true }
        );
        
        if (!shareLink) {
            return res.status(404).json({ 
                success: false, 
                error: 'Invalid, expired, or already claimed marriage link' 
            });
        }
        
        // Return the data needed for minting
        res.json({
            success: true,
            nftId: shareLink.nftId,
            firstPartnerAddress: shareLink.firstPartnerAddress,
            firstPartnerName: shareLink.firstPartnerName,
            secondPartnerName: shareLink.secondPartnerName
        });
    } catch (error) {
        console.error('Error claiming share link:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;