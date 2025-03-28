const generateMarriageCertificate = require('./utils/generateImage');
const fs = require('fs').promises;

async function test() {
    try {
        const certificateData = {
            husbandName: "Jake",
            wifeName: "Shawty",
            date: "February 27, 2025",
            certificateNumber: "MC2025001"
        };

        const imageBuffer = await generateMarriageCertificate(certificateData);
        await fs.writeFile('generated-certificate.jpg', imageBuffer);
        console.log('Certificate generated successfully!');
    } catch (error) {
        console.error('Error:', error);
    }
}

test(); // Call the function