import mongoose from "mongoose";

let isConnected = false;

export const connectToDB = async () => {
  const MONGODB_URI = process.env.MONGODB_URI as string;

  mongoose.set("strictQuery", true);
  if (!MONGODB_URI) {
    console.log("Missing DB URI");
    return;
  }
  if (isConnected) {
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI, {
      dbName: "talkini",
    });

    isConnected = true;
    console.log("MongoDB Connected.");
  } catch (error) {
    console.log(error);
    throw new Error("MongoDB connection error.");
  }
};
