const mongoose = require('mongoose');

try { require('dotenv').config({ path: '.env.local' }) } catch (_) {}
try { require('dotenv').config() } catch (_) {}

const connectDB = async () => {
    // Get URI at runtime - supports multiple env names for Vercel
    const uri = process.env.Mongoose_URI || process.env.MONGODB_URI || process.env.DATABASE_URL
    if (!uri || typeof uri !== 'string' || uri.trim() === '') {
        const msg = 'MongoDB URI missing! Vercel me add karo: Settings > Environment Variables > Mongoose_URI (ya MONGODB_URI)'
        console.error(msg)
        throw new Error(msg)
    }
    try {
        const connection = await mongoose.connect(uri.trim())
        console.log(`Connected to MongoDB: ${connection.connection.host}`)
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`)
        throw error
    }
}

module.exports = connectDB