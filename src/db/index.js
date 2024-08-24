import mongoose from 'mongoose';
import dotenv from 'dotenv';
import DB_NAME from '../constanst.js'


const connectDB = async () => {
  try {
    // Create the connection URI
    const connectionUri = `${process.env.MONGODB_URI}/${DB_NAME}`;
    
    // Connect to MongoDB
    const connectionInstance = await mongoose.connect(connectionUri, {
     
    });
  
    console.log(`/n MongoDB connected !! DB Host: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection Failed" , error);
    process.exit(1);
  }
};

export default connectDB;
