import mongoose from "mongoose";

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