import { model, Schema } from "mongoose";
import {orderStatus, paymentMethod } from "../../src/utilis/enums.js";

const orderSchema=new Schema({
    user:{type:Schema.Types.ObjectId,ref:"User",required:true},
    products:[
        {
            productId:{type:Schema.Types.ObjectId,ref:"Product",required:true},
            name:String,
            itemPrice:Number,
            quantity:Number,
            finalPrice:Number
        }
    ],
    address:{type:String,required:true},
    phone:{type:String,required:true},
    coupon:{
        couponId:{type:Schema.Types.ObjectId,ref:"Coupon"},
        code:String,
        discount:Number
    },
    status:{
        type:String,
        enum:Object.values(orderStatus),
        default:orderStatus.PLACED
    },
    paymentMethod:{
        type:String,
        enum:Object.values(paymentMethod),
        default:paymentMethod.CASH,
        required:true
    },
    orderPrice:Number
},{timestamps:true,versionKey:false})

export const Order=model('Order',orderSchema)