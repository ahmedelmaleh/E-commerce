import Stripe from "stripe"
import { Cart } from "../../../db/models/cart.model.js"
import { Coupon } from "../../../db/models/coupon.model.js"
import { Order } from "../../../db/models/order.model.js"
import { Product } from "../../../db/models/product.model.js"
import { AppError } from "../../utilis/appError.js"
import { discountTypes, paymentMethod } from "../../utilis/enums.js"
import { clearCart, updateProductQuantity } from "./services/order.servise.js"

export const createOrder=async(req,res,next)=>{
    const {address,phone,payment,coupon}=req.body
    let couponExist;
    if(coupon){
        const couponExist=await Coupon.findOne({couponCode:coupon})
        if(!couponExist){
            return next(new AppError("coupon not found",404))
        }
        if(couponExist.fromDate>Date.now()||couponExist.toDate<Date.now()){
            return next(new AppError("invalid coupon"))
        }
    }

    const cart=await Cart.findOne({user:req.authUser._id})
    if(cart.products.length==0){
        return next(new AppError("Your cart is empty",400))
    }
    let products=cart.products
    let orderProducts=[]
    let orderPrice=0
    for(const product of products){
        const productExist=await Product.findById(product.productId)
        if(!productExist){
            return next(new AppError("product not found",404))
        }
        if(!productExist.inStock(product.quantity)){
            return next(new AppError("out of stock",400))
        }
        orderProducts.push({productId:product._id,
            name:productExist.name,
            itemPrice:productExist.price,
            finalPrice:productExist.finalPrice*product.quantity,
            quantity:product.quantity
        })
        orderPrice+=productExist.finalPrice*product.quantity
    }
    let finalPrice=0
    if(couponExist?.discountType==discountTypes.FIXED_AMOUNT){
        finalPrice=orderPrice-couponExist.discountAmount
    }else if(couponExist?.discountType==discountTypes.PERCENTAGE){
        finalPrice=orderPrice-(orderPrice*couponExist.discountAmount)/100
    }
    const order=new Order({
        user:req.authUser._id,
        address,
        phone,
        paymentMethod:payment,
        products:orderProducts,
        orderPrice,
        finalPrice:finalPrice==0?orderPrice:finalPrice
    })
    const createdOrder=await order.save()
    if(!createdOrder){
        return next(new AppError("fail to create the order",500))
    }
    if(payment==paymentMethod.CASH){
        const result=await clearCart(req.authUser._id)
        if(result.errMessage){
            return next(new AppError(result.errMessage,500))
        }
        for(const product of products){
            await updateProductQuantity(product.productId,product.quantity)
        }
    }
    if(payment==paymentMethod.VISA){
        const stripe=new Stripe(process.env.STRIPE_KEY)
        const{url}=await stripe.checkout.sessions.create({
            mode:"payment",
            payment_method_types:["card"],
            success_url:"https://www.facebook.com",
            cancel_url:"https://google.com",
            line_items:createdOrder.products.map((product)=>{
                return{
                    price_data:{
                        currency:"egp",
                        product_data:{name:product.name},
                        unit_amount:product.finalPrice*100,
                    },
                    quantity:product.quantity,
                }
            })
        })
        return res.status(200).json({url})
    }
    return res.status(201).json({
        message: "order created successfully",
        success: true,
        data: createdOrder
      });
}