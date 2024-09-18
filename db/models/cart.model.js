import {model, Schema} from "mongoose"
export const cartSchema=new Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    products:[
        {
            productId:{
                type:Schema.Types.ObjectId,
                ref:"Product"
            },
            quantity:Number
        }
    ]
},{timestamps:true,versionKey:false})
export const Cart=model('Cart',cartSchema)