import { Cart } from "../../../db/models/cart.model.js"
import { Product } from "../../../db/models/product.model.js"
import { AppError } from "../../utilis/appError.js"

export const addToCart=async(req,res,next)=>{
    const {productId,quantity}=req.body
    const productExist=await Product.findById(productId)
    if(!productExist){
        return next(new AppError("Product not found",404))
    }
    if(!productExist.inStock(quantity)){
        return next(new AppError("Out of stock",400))
        
    }
    const userCart=await Cart.findOneAndUpdate(
        {
            user:req.authUser._id,'products.productId':productId
        },
        {$set:{"products.$.quantity":quantity}},
        {new:true}
    )
    let data=userCart
    if(!userCart){
       data= await Cart.findOneAndUpdate({user:req.authUser._id},
            {$push:{products:{productId,quantity}}},{new:true}
        )
    }
    return res.status(200).json({message:"product added to cart successfully",success:true,data})
}