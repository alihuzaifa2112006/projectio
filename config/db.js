const mongoose = require('mongoose');
const path = require('path');

const connectDB = async () => {
    // Load .env at runtime (Next.js loads it too, but dotenv ensures it)
    const root = path.resolve(process.cwd());
    require('dotenv').config({ path: path.join(root, '.env.local') });
    require('dotenv').config({ path: path.join(root, '.env') });

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