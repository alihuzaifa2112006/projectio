const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: ['.env.local', '.env'] });

// Support multiple env variable names (Vercel often uses MONGODB_URI)
const Mongoose_URL = process.env.Mongoose_URI || process.env.MONGODB_URI

const connectDB = async () => {
    if (!Mongoose_URL || typeof Mongoose_URL !== 'string') {
        console.error('MongoDB URI is missing! Add Mongoose_URI or MONGODB_URI in Vercel: Project Settings > Environment Variables')
        throw new Error('MongoDB URI not configured. Set Mongoose_URI or MONGODB_URI in your environment.')
    }
    try {
        const connection = await mongoose.connect(Mongoose_URL)
        console.log(`Connected to MongoDB: ${connection.connection.host}`)

    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`)
        throw error
    }
}

module.exports = connectDB