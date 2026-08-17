import razorpay from "../utils/razorpay.js";
import crypto from "crypto";

const createdOrder = async (req, res) => {
    try{
        const {amount}= req.body;

        if(!amount || amount <= 0) {
            return res.status(400).json({message:"Invalid amount"});
        }

        const options = {
            amount: amount * 100, // Amount in paise
            currency: "INR",
            receipt: crypto.randomBytes(10).toString("hex"),
        };

        const order = await razorpay.orders.create(options);
        res.status(201).json(order);
    }
    catch(err){
        console.error("Error creating order:", err);
        res.status(500).json({message:"Server error"});
    }

};

const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;    
        const generated_signature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest('hex');

        if (generated_signature === razorpay_signature) {
            res.status(200).json({ message: "Payment verified successfully" });
        } else {
            res.status(400).json({ message: "Payment verification failed" });
        }
    }
    catch (err) {
        console.error("Error verifying payment:", err);
        res.status(500).json({ message: "Server error" });
    }
};

export { createdOrder, verifyPayment };

