import { Cart } from "../../../../db/models/cart.model.js"
import { Product } from "../../../../db/models/product.model.js"

export const clearCart=async(userId)=>{
    const updatedCart=await Cart.findOneAndUpdate(
        {user:userId},
        {products:[]}
    )
    if(!updatedCart){
        return{errMessage:"fail to update cart"}
    }
    return true
}

export const updateProductQuantity=async(productId,quantity)=>{
    await Product.findByIdAndUpdate(productId,{$inc:{stock:-quantity}})
}