require("dotenv").config();
const express = require("express");
const cors = require("cors");
const metadataRoutes = require("./routes/metadata");
const imageRoutes = require("./routes/image");
const shareRoutes = require('./routes/share');
const connectDB = require('./db');

const app = express();

// Connect to database
connectDB();

app.use(cors({
    origin: ['http://localhost:3000', 'https://gateway.pinata.cloud']
}));
app.use(express.json());

// Routes
app.use("/metadata", metadataRoutes);
app.use("/images", imageRoutes);
app.use("/share", shareRoutes);

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Server error', message: err.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
