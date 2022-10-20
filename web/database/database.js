import mongoose from "mongoose";

export const connect = async () => {
  try {
    await mongoose.connect(
      "mongodb://127.0.0.1:27017/book-appointment-app?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.6.0"
    );
    console.log("Connecting to MongoDB Atlas cluster...");
  } catch (error) {
    console.error("Connection to MongoDB Atlas failed!", error);
  }
};
