import mongoose from "mongoose";

export const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connecting to MongoDB Atlas cluster...");
  } catch (error) {
    console.error("Connection to MongoDB Atlas failed!", error);
  }
};
