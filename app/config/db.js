const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

function loadEnvFallback() {
    const root = path.join(__dirname, '..', '..');
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
    if (mongoose.connection.readyState === 1) return;

    const root = path.join(__dirname, '..', '..');
    require('dotenv').config({ path: path.join(root, '.env.local'), override: true });
    require('dotenv').config({ path: path.join(root, '.env'), override: true });
    loadEnvFallback();

    const uri = process.env.MONGODB_URI || process.env.Mongoose_URI || process.env.DATABASE_URL;
    if (!uri || typeof uri !== 'string' || uri.trim() === '') {
        const msg = 'MongoDB URI missing! Add MONGODB_URI in .env or Vercel Environment Variables';
        console.error(msg);
        throw new Error(msg);
    }
    try {
        await mongoose.connect(uri.trim(), {
            serverSelectionTimeoutMS: 20000,
            connectTimeoutMS: 20000,
        });
        console.log(`Connected to MongoDB: ${mongoose.connection.host}`);
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        throw error;
    }
};

module.exports = connectDB;
