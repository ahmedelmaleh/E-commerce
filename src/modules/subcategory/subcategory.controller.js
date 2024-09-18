import slugify from "slugify"
import { AppError } from "../../utilis/appError.js"
import { Subcategory } from "../../../db/models/subcategory.model.js"
import { Category } from "../../../db/models/category.model.js";

export const addSubCategory = async (req, res, next) => {
    req.body.slug = slugify(req.body.name);
    const categoryExists = await Category.findById(req.body.category);
    categoryExists || next(new AppError('Category not found', 404));
    !categoryExists || (async() => {
        const subCategory = new Subcategory(req.body);
        const newSubCategory = await subCategory.save();
        res.status(201).json({ message: 'SubCategory added successfully', success: true, data: newSubCategory });
    })();
};
export const getAllSubCategory=async(req,res,next)=>{
    const SubCategory= await Subcategory.find().populate([{path:'category'}])
    res.status(200).json({success:true,data:SubCategory})
}
export const getSubCategory=async(req,res,next)=>{
    const SubCategory= await Subcategory.findById(req.params.id).populate([{path:'category'}])
    SubCategory || next(new AppError('SubCategory not found',404))
    !SubCategory || res.status(200).json({success:true,data:SubCategory})
}
export const updateSubCategory = async (req, res, next) => {
    req.body.slug = slugify(req.body.name);
    const categoryExists = await Category.findById(req.body.category);
    categoryExists || next(new AppError('Category not found', 404));
    !categoryExists || (async() => {
        const updatedSubCategory = await Subcategory.findByIdAndUpdate(req.params.id, req.body, { new: true });
        updatedSubCategory || next(new AppError('SubCategory not found', 404));
        !updatedSubCategory || res.status(200).json({ message: 'SubCategory updated successfully', success: true, data: updatedSubCategory });
    })();
};
export const deleteSubCategory=async(req,res,next)=>{
    const deletedSubCategory= await Subcategory.findByIdAndDelete(req.params.id)
    deletedSubCategory || next(new AppError('SubCategory not found',404))
    !deletedSubCategory || res.status(200).json({message:'SubCategory deleted succesfully',success:true,data:deletedSubCategory})
}