import { User } from "../../../db/models/user.model.js"
import { AppError } from "../../utilis/appError.js"
import cloudinary from "../../utilis/cloud.js"
import { status } from "../../utilis/enums.js"

export const addUser=async(req,res,next)=>{
    const {name,email,phone,role}=req.body
    const userExist=await User.findOne({email})
    if(userExist){
        return next(new AppError("User already exist",409))
    }
    if(req.file){
    const {secure_url,public_id}=await cloudinary.uploader.upload(req.file.path,{folder:"uploads/users"})
    req.body.image={secure_url,public_id}
    }
    const createdUser=await User.create({
        name,
        email,
        phone,
        role,
        password:"e-commerce",
        status:status.VERIFIED,
        image:req.body.image
    })
    if(!createdUser){
      return next(new AppError("Failed to create user in database", 500));
    }
    return res.status(201).json({
        message: "User created successfully",
        success: true,
        data: createdUser
      });
}
export const getAllUsers = async (req, res, next) => {
  const users = await User.find().select("-password"); 
  return res.status(200).json({
    message: "Users retrieved successfully",
    success: true,
    data: users
  });
};
export const getUser = async (req, res, next) => {
  const { userId } = req.params;
  const user = await User.findById(userId).select("-password"); 
  if (!user) {
    return next(new AppError("User not found", 404));
  }
  return res.status(200).json({
    message: "User retrieved successfully",
    success: true,
    data: user
  });
};
export const updateUser = async (req, res, next) => {
  const { userId } = req.params;
  const { name, email, phone, role } = req.body;
  const user = await User.findById(userId);
  if (!user) {
    return next(new AppError("User not found", 404));
  }
  let image;
  if (req.file) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: "uploads/users" });
    image = { secure_url, public_id };
    if (user.image && user.image.public_id) {
      await cloudinary.uploader.destroy(user.image.public_id);
    }
  }
  user.name = name || user.name;
  user.email = email || user.email;
  user.phone = phone || user.phone;
  user.role = role || user.role;
  user.image = image || user.image;
  const updatedUser = await user.save();
  return res.status(200).json({
    message: "User updated successfully",
    success: true,
    data: updatedUser
  });
};
export const deleteUser = async (req, res, next) => {
  const { userId } = req.params;
  const user = await User.findById(userId);
  if (!user) {
    return next(new AppError("User not found", 404));
  }
  if (user.image && user.image.public_id) {
    await cloudinary.uploader.destroy(user.image.public_id);
  }
  const deletedUser = await User.findByIdAndDelete(userId);
  if (!deletedUser) {
    return next(new AppError("Failed to delete user", 500));
  }
  return res.status(200).json({
    message: "User deleted successfully",
    success: true,
  });
};

