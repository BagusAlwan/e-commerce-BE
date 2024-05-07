const { default: mongoose } = require("mongoose")
const dotenv = require('dotenv').config()

const dbConnect = () => {
    try {
        const conn = mongoose.connect(process.env.MONGO_URI);
        console.log("DB Connected")
    } catch (error) {
        throw new Error(error);
        console.log("DB Error")
    }
};
module.exports = dbConnect;