import slugify from "slugify"
import { Category } from "../../../db/models/category.model.js"
import { AppError } from "../../utilis/appError.js"

export const addCategory=async(req,res,next)=>{
    let {name}=req.body
    name=name.toLowerCase()
    const existingCategory = await Category.findOne({ name});
    if (existingCategory) {
        next(new AppError('Category already exist',409))
    }
    req.body.slug=slugify(req.body.name)
    if(req.file) req.body.image=req.file.filename
    const category=new Category(req.body)
    const newCategory=await category.save()
    res.status(201).json({message:'Category added Succesfully',success:true,data:newCategory})
}
export const getAllCategories=async(req,res,next)=>{
    const categories= await Category.find()
    res.status(200).json({success:true,data:categories})
}
export const getCategory=async(req,res,next)=>{
    const category= await Category.findById(req.params.id)
    category || next(new AppError('Category not found',404))
    !category || res.status(200).json({success:true,data:category})
}
export const updateCategory=async(req,res,next)=>{
    req.body.slug=slugify(req.body.name)
    if(req.file) req.body.image=req.file.filename
    const updatedCategory= await Category.findByIdAndUpdate(req.params.id,req.body,{new:true})
    updatedCategory || next(new AppError('Category not found',404))
    !updatedCategory || res.status(200).json({message:'Category updated succesfully',success:true,data:updatedCategory})
}
export const deleteCategory=async(req,res,next)=>{
    const deletedCategory= await Category.findByIdAndDelete(req.params.id)
    deletedCategory || next(new AppError('Category not found',404))
    !deletedCategory || res.status(200).json({message:'Category deleted succesfully',success:true,data:deletedCategory})
}