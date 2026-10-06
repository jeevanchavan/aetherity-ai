import mongoose from "mongoose";

const connectToDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI environment variable is missing or undefined.");
        }
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log("MONGODB CONNECTED SUCCESSFULLY");
    } catch (error) {
        console.error("CRITICAL: Error connecting to MongoDB:", error.message || error);
        throw error;
    }
};

export default connectToDB