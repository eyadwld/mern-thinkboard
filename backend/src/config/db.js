import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");
  } catch (error) {
    console.log("Error connecting to MongoDB", error);
    process.exit(1); // exit the process if there is an error 1 menas exit with failure and 0 means exit with success
  }
};

export default connectDB;
