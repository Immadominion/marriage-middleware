const { createCanvas, loadImage, registerFont } = require('canvas');
const path = require('path');

// Register Symphony font
registerFont(path.join(__dirname, '../assets/fonts/SymphonyPro-Regular.ttf'), { family: 'Symphony' });
registerFont(path.join(__dirname, '../assets/fonts/Lora-VariableFont_wght.ttf'), { family: 'Lora' });

async function generateMarriageCertificate(data) {
    try {
        // Load the certificate template
        const templatePath = path.join(__dirname, '../assets/certificate-template.jpg');
        console.log('Template path:', templatePath);
        const image = await loadImage(templatePath);

        // Create canvas with image dimensions
        const canvas = createCanvas(image.width, image.height);
        const ctx = canvas.getContext('2d');

        // Draw the base image
        ctx.drawImage(image, 0, 0, image.width, image.height);

        // Configure text style
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'center';

        // Set font for names
        ctx.font = 'bold 230px "Symphony"';
        ctx.fillStyle = '#b58e3c';
        
        // Calculate vertical position (48% from top)
        const verticalPosition = canvas.height * (48 / 100);

        // Draw the combined names with &
        const combinedNames = `${data.husbandName} & ${data.wifeName}`;
        ctx.fillText(combinedNames, canvas.width / 2, verticalPosition);
        
        ctx.font = '42px "Lora"';
        ctx.fillStyle = '#000000';
        
        // Calculate text measurements
        const brideMetrics = ctx.measureText(data.wifeName);
        const groomMetrics = ctx.measureText(data.husbandName);
        
        // Calculate total width needed for both names and spacing
        const totalWidth = brideMetrics.width + groomMetrics.width + 1200; // 200px minimum spacing between names
        
        // Calculate starting positions for each name
        const nameY = verticalPosition + 450;
        const centerX = canvas.width / 2;
        
        // SWAPPED POSITIONS: Position groom's name on left
        const groomX = centerX - (totalWidth / 2.3);
        ctx.fillText(`${data.husbandName}.base.eth`, groomX, nameY);
        
        // SWAPPED POSITIONS: Position bride's name on right
        const brideX = centerX + (totalWidth / 2) - brideMetrics.width;
        ctx.fillText(`${data.wifeName}.base.eth`, brideX, nameY);
        
        // Reset fill style for remaining text
        ctx.fillStyle = '#000000';
        
        // Add date
        ctx.font = '60px "Lora"';
        ctx.fillStyle = '#000000';
        
        // Calculate starting position (65% from top)
        const startY = canvas.height * (65 / 100);
        const lineHeight = 80; // Adjust this value to control spacing between lines

        // Function to add ordinal suffix to day
        const getOrdinalSuffix = (day) => {
            const j = day % 10;
            const k = day % 100;
            if (j == 1 && k != 11) return day + "st";
            if (j == 2 && k != 12) return day + "nd";
            if (j == 3 && k != 13) return day + "rd";
            return day + "th";
        };

        // Get current date
        const currentDate = new Date();
        const day = getOrdinalSuffix(currentDate.getDate());
        const month = currentDate.toLocaleString('default', { month: 'long' });
        const year = currentDate.getFullYear();
        
        // Format UTC time (HH:MM:SS UTC)
        const utcTime = currentDate.toISOString().split('T')[1].split('.')[0];
        
        // Create array of lines with formatted date and UTC time
        const dateLines = [
            `On this ${day} Day of ${month} in the year ${year}`,
            `on Base, Onchain Forever - ${utcTime} UTC`
        ];

        // Draw each line centered
        dateLines.forEach((line, index) => {
            const y = startY + (index * lineHeight);
            ctx.fillText(line, canvas.width / 2, y);
        });

        // REMOVED: Certificate number

        const officiantIcon = await loadImage(path.join(__dirname, '../assets/marriage-onchain.png'));
        const iconSize = 120; // Reduced from 150 to maintain aspect ratio
        // Calculate positions to center the icon and text combination
        const iconY = canvas.height - 370; // Move up from bottom
        const iconX = (canvas.width / 2) - 300; // Adjust for combined width of icon + text
 
        // Draw SVG icon
        ctx.drawImage(officiantIcon, iconX, iconY, 220, iconSize);
        
        // Add officiant text with proper spacing
        ctx.font = '44px "Lora"';
        const textX = iconX + iconSize + 210; // Add 20px spacing between icon and text
        const textY = iconY + (iconSize/2) + 8; // Vertically center with icon
        ctx.fillText('married.base.eth', textX, textY);

        // Convert to buffer
        const buffer = canvas.toBuffer('image/jpeg');
        return buffer;

    } catch (error) {
        console.error('Error generating certificate:', error);
        throw error;
    }
}

module.exports = generateMarriageCertificate;