const express = require('express');
const router = express.Router();

router.get('/:id', async (req, res) => {
    const { id } = req.params; // NFT ID or wallet address

    // Fetch user details from DB (or generate dynamically)
    //Get user details from frontend
    const userData = { 
        name: "John & Jane Doe",
        date: "2025-03-01"
    };

    res.json({
        name: "Marriage Certificate NFT",
        description: `On-chain marriage certificate for ${userData.name}`,
        image: `https://yourbackend.com/images/certificate/${id}`,
        attributes: [
            { trait_type: "Couple", value: userData.name },
            { trait_type: "Marriage Date", value: userData.date }
        ]
    });
});

module.exports = router;
