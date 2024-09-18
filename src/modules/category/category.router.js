import { Router } from "express";
import { addCategory, deleteCategory, getAllCategories, getCategory, updateCategory } from "./category.controller.js";
import { asyncHandeler } from "../../utilis/asyncHandler.js";
import { fileUpload } from "../../fileupload/fileupload.js";
import { validate } from "../../middleware/validation.js";
import { addCategoryVal } from "./category.validate.js";
import { isAuthenticate, isAuthorized } from "../../middleware/authentication.js";
import { roles } from "../../utilis/enums.js";

const categoryRouter=Router()
categoryRouter.post('/',asyncHandeler(isAuthenticate()),isAuthorized([roles.ADMIN,roles.SELLER]),fileUpload({folder:'category'}).single('image'),validate(addCategoryVal),asyncHandeler(addCategory))
categoryRouter.get('/',asyncHandeler(getAllCategories))
categoryRouter.get('/:id',asyncHandeler(getCategory))
categoryRouter.put('/:id',isAuthenticate(),isAuthorized([roles.ADMIN,roles.SELLER]),fileUpload({folder:'category'}).single("image"),asyncHandeler(updateCategory))
categoryRouter.delete('/:id',isAuthenticate(),isAuthorized([roles.ADMIN,roles.SELLER]),asyncHandeler(deleteCategory))

export default categoryRouter