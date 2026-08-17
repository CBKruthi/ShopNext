import express from "express";
import cors from "cors";
import dotenv from "dotenv"
dotenv.config();
import connectDB from "./config/db.js"
import authRouter from "./routes/authRoutes.js"
import productRouter from "./routes/productRoutes.js"
import orderRouter from "./routes/orderRoutes.js"
import analyticsRouter from "./routes/analyticsRoute.js"
const PORT=5000;

connectDB();
const app=express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());


app.use('/api/auth',authRouter );
app.use('/api/products', productRouter );
// app.use('/api/payment', );
app.use('/api/orders', orderRouter );
app.use('/api/analytics', analyticsRouter );

console.log({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY ? "loaded" : "missing",
    api_secret: process.env.CLOUDINARY_API_SECRET ? "loaded" : "missing"
});

app.get("/", (req,res)=>{
    res.send("shopnest is wroking in backend properly")
});

app.listen(PORT|| process.env.PORT ,(req,res)=>{
    console.log(`server running on ${PORT}`);
})
