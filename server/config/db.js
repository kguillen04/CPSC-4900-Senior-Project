import mongoose from "mongoose";

/**
 * Initializes a connection to the MongoDB database using Mongoose.
 * 
 * Expected environment variable:
 * - ATLAS_URI: the connection string for the MongoDB Atlas cluster
 */
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.ATLAS_URI, {
            dbName: "adaptive-learning"
        });
        console.log("MongoDB connected (Mongoose)");
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

export default connectDB;