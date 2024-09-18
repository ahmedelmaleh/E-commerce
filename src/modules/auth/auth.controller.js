import bcrypt from "bcrypt"
import { User } from "../../../db/models/user.model.js"
import { AppError } from "../../utilis/appError.js"
import { sendEmail } from "../../utilis/sendemail.js"
import { generateToken, verifyToken } from "../../utilis/token.js"
import { status } from "../../utilis/enums.js"
import { Cart } from "../../../db/models/cart.model.js"
import { generateOTP } from "../../utilis/otp.js"
import { hashPassword } from "../../utilis/hash-and-compare.js"

export const signUp=async(req,res,next)=>{
    let {name,email,password,phone}=req.body
    const userExist=await User.findOne({$or:[{email},{phone}]})
    if(userExist){
        return next(new AppError("User already exist",409))
    }
    password=bcrypt.hashSync(password,8)
    const user=new User({
        name,
        email,
        password,
        phone
    })
    const createdUser=await user.save()
    if(!createdUser){
        return new AppError("failed to create user",500)
    }
    const token=generateToken({payload:{email}})
    await sendEmail({to:email,subject:"verify your account",html:`<p>Click on link to verify account <a href="${req.protocol}://${req.headers.host}/api/auth/verify/${token}">Link</a></p>`})
    return res.status(201).json({message:"User created successfully",success:true,data:createdUser})
}
export const verifyAccount=async(req,res,next)=>{
    const {token}=req.params
    const payload=verifyToken({token})
    const user=await User.findOneAndUpdate({email:payload.email,status:"pending"},{status:"verified"})
    await Cart.create({user:user._id,products:[]})
    return res.status(200).json({message:"User verified success",success:true,})
}
export const login=async(req,res,next)=>{
    const {email,phone,password}=req.body
    const userExist=await User.findOne({$or:[{email},{phone}],status:status.VERIFIED})
    if(!userExist){
        return next(new AppError("invalid Credentials",400))
    }
    const match=bcrypt.compareSync(password,userExist.password)
    if(!match){
        return next(new AppError("invalid Credentials",400))
    }
    const token=generateToken({payload:{_id:userExist._id,email}})
    return res.status(200).json({
        message:"Login successfully",
        success:true,
        token
    })
}

export const forgetPassword=async(req,res,next)=>{
    const {email}=req.body
    const userExist=await User.findOne({email})
    if(!userExist){
        return next(new AppError("User not found",404))
    }
    if(userExist.otp&&userExist.expireDateOtp>Date.now()){
        return next(new AppError("You already has otp",400))
    }
    const otp=generateOTP()
    userExist.otp=otp
    userExist.expireDateOtp=Date.now()+15*60*1000
    await userExist.save()
    await sendEmail({
        to:email,subject:"Forget password",html:`<h1>you request forget password your otp is ${otp}\n
        if not you reset password
        </h1>`
    })
    return res.status(200).json({message:"Please chech your email",success:true})
}

export const changePassword=async(req,res,next)=>{
    const {otp,newPassword,email}=req.body
    const user=await User.findOne({email})
    if(!user){
        return next(new AppError("User not found",404))
    }
    if(user.otp!=otp){
        return next(new AppError("invalid otp",401))

    }
    if(user.expireDateOtp<Date.now()){
        const secondOTP=generateOTP()
        user.otp=secondOTP
        user.expireDateOtp=Date.now()+5*60*1000
        await user.save()
        await sendEmail({to:email,subject:"Resent otp",html:`<h1>your otp is ${secondOTP}</h1>`})
        return res.status(200).json({message:"Please chech your email",success:true})  
    }
    const hashedPassword=hashPassword({password:newPassword})
    user.password=hashedPassword
    user.otp=undefined
    user.expireDateOtp=undefined
    await user.save()
    return res.status(200).json({message:"Password updated successfully",success:true})
}