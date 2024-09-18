import { Router } from "express";
import { asyncHandeler } from "../../utilis/asyncHandler.js";
import { addSubCategory, deleteSubCategory, getAllSubCategory, getSubCategory, updateSubCategory } from "./subcategory.controller.js";

const SubCategoryRouter=Router()
SubCategoryRouter.post('/',asyncHandeler(addSubCategory))
SubCategoryRouter.get('/',asyncHandeler(getAllSubCategory))
SubCategoryRouter.get('/:id',asyncHandeler(getSubCategory))
SubCategoryRouter.put('/:id',asyncHandeler(updateSubCategory))
SubCategoryRouter.delete('/:id',asyncHandeler(deleteSubCategory))

export default SubCategoryRouter