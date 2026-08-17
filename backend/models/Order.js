import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:true
    },
    items:[
            {
            
            productId:{
                type:mongoose.Schema.ObjectId,
                ref:'Product',
                required:true
            },
            quantity:{
                type:Number,
                required: true
            },
            price:{
                type:Number,
                required:true
            }
            }
    ],
    totalAmount:{
        type:Number,
        required:true
    },
    address:{
        fullName:{
            type:String,
            required:true
        },
        street:{
            type:String,
            required:true
        },
        city:{
            type:String,
            required:true
        },
        state:{
            type:String,
            required:true
        },
        zipCode:{
            type:String,
            required:true
        },
        country:{
            type:String,
            required:true
        }
    },
    paymentId:{
        type:String,
    },
    status:{
        type:String,
        enum:['pending','shipped','delivered'],
        default:'pending'
    }

},{
    timestamps:true
});

export default mongoose.model("Order",orderSchema);