const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// mongodb+srv://alihuzaifa1917_db_user:x52gwIZplLKomf2U@clustorforprojectmanage.t3olvxm.mongodb.net/
const Mongoose_URL = process.env.Mongoose_URI

const connectDB = async () => {
    try {
        const connection = await mongoose.connect(Mongoose_URL)
        console.log(`Connected to MongoDB: ${connection.connection.host}`)

    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`)
        process.exit(1)
    }
}

module.exports = connectDB