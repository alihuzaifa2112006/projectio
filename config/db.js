const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

function loadEnvFallback() {
    const root = path.join(__dirname, '..');
    const envPath = path.join(root, '.env');
    if (fs.existsSync(envPath)) {
        const content = fs.readFileSync(envPath, 'utf8');
        content.split('\n').forEach(line => {
            const m = line.match(/^([^#=]+)=(.*)$/);
            if (m) {
                const key = m[1].trim();
                const val = m[2].trim().replace(/^["']|["']$/g, '');
                if (!process.env[key] || process.env[key] === '') process.env[key] = val;
            }
        });
    }
}

const connectDB = async () => {
    const root = path.join(__dirname, '..');
    require('dotenv').config({ path: path.join(root, '.env.local'), override: true });
    require('dotenv').config({ path: path.join(root, '.env'), override: true });
    loadEnvFallback();

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