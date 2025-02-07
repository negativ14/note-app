import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const mongoUrl = process.env.MONGODB_URL || "your_default_mongodb_url";
    await mongoose.connect(mongoUrl);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error(error);
  }
}