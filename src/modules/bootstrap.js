import express from 'express'
import categoryRouter from "./category/category.router.js"
import { globalHandler } from '../utilis/asyncHandler.js'
import SubCategoryRouter from './subcategory/subcategory.router.js'
import brandRouter from './brand/brand.router.js'
import productRouter from './product/product.router.js'
import authRouter from './auth/auth.router.js'
import adminRouter from './admin/admin.router.js'
import wishlistRouter from './wishlist/wishlist.router.js'
import reviewRouter from './review/review.router.js'
import couponRouter from './coupon/coupon.router.js'
import cartRouter from './cart/cart.router.js'
import userRouter from './user/user.router.js'

export const bootstrap=(app)=>{
    app.use(express.json())
    app.use('/uploads',express.static('uploads'))
    app.use('/api/categories',categoryRouter)
    app.use('/api/subcategories',SubCategoryRouter)
    app.use('/api/brands',brandRouter)
    app.use('/api/products',productRouter)
    app.use('/api/auth',authRouter)
    app.use('/api/admin',adminRouter)
    app.use('/api/wishlist',wishlistRouter)
    app.use('/api/review',reviewRouter)
    app.use('/api/coupon',couponRouter)
    app.use('/api/cart',cartRouter)
    app.use('/api/user',userRouter)
    app.use(globalHandler)


}