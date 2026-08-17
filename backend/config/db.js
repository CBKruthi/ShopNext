import mongoose from "mongoose"

async function connectDB(){
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log("db connected");
    }
    catch(err){
         console.log("Mongo conn failed", err.message);
    }
}

export default connectDB;
