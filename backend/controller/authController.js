import User from "../models/User.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import sendEmail from "../utils/sendEmail.js";


const generateToken = (id)=>{
     return jwt.sign({id},process.env.JWT_Secret, {expiresIn:'30d'});
}

export const RegisterUser = async (req , res )=>{
  const {name,email,password} = req.body;

  try{
     const existUser =await User.findOne({email});
     if(existUser){
        return res.status(400).json({message:"User already exists"});
     }


    const salt= await bcrypt.genSalt(10);

     
     const hashedPassword= await bcrypt.hash(password,salt);


     const user =  await User.create({
        name,
        email,
        password:hashedPassword,
     });
     
     if(user){
        const otp= Math.floor(100000+Math.random()*900000).toString();

        const message=`
                       Welcome to ShopNest, ${name} !!!!!
                       Your OTP for ShopNest registration is: ${otp}`;

        await sendEmail(email,'OTP for registration',message);

        await User.findByIdAndUpdate(user._id,{
            OTP:otp,
            OTPExpires:Date.now()+10*60*1000
        });

        res.status(201).json({
            _id:user._id,
            name:user.name,
            email:user.email,
            role:user.role,
            token:generateToken(user._id)
        })
     }
    }
  catch(err){
    res.status(500).json({message: `${err.message}`});
  }
};


export const loginUser = async (req,res)=>{
    const {email,password} = req.body;
    try{
        
        const user = await User.findOne({email});

        if(!user){
            return res.status(400).json({message:`invalid email or password`});
        }


        const passwordMatch = await bcrypt.compare(password,user.password);

        if(!passwordMatch){
            return res.status(400).json({message:`invalid email or password`});
        }

        if(!user.verified){
            return res.status(400).json({message:`Email not verified. Please verify your email.`});
        }

        res.status(200).json({
            _id:user._id,
            name:user.name,
            email:user.email,
            role:user.role,
            verified:user.verified,
            token:generateToken(user._id)
        });
    }
    catch(err){
        res.status(500).json({message: `${err.message}`});
    }
}

export const verifyEmail = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.OTP !== otp) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        if (user.OTPExpires < Date.now()) {
            return res.status(400).json({ message: "OTP has expired" });
        }

        user.verified = true;
        user.OTP = undefined;
        user.OTPExpires = undefined;
        await user.save();  

        res.json({ message: "Email verified successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }

}

export const makeAdmin = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        user.role = "admin";
        await user.save();

        res.json({
            message: "User is now an admin",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

export const getUsers = async (req,res)=>{
     try{
        const users = await User.find({}).select('-password');
        res.json(users);
     }
     catch(err){
        res.status(500).json({message:'Server error'});
     }
}

