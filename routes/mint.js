const express = require('express');
const { mintNFT } = require('../services/blockchain');
const router = express.Router();

router.post('/', async (req, res) => {
    const { walletAddress, details } = req.body;
    try {
        const tx = await mintNFT(walletAddress, details);
        res.json({ success: true, tx });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
