const mongoose = require("mongoose")










const connectDb = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL);
        console.log("db connected");
    } catch (err) {
        console.error("Mongo db connection failed" + err);
    }
};

module.exports = connectDb;