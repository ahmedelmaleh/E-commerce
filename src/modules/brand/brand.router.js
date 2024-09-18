import { Router } from "express";
import { cloudUpload } from "../../fileupload/fileupload-cloud.js";
import { validate } from "../../middleware/validation.js";
import { addBrandVal, updateBrandVal } from "./brand.validate.js";
import { asyncHandeler } from "../../utilis/asyncHandler.js";
import { addBrand, deleteBrand, getAllBrands, getBrand, updateBrand } from "./brand.controller.js";
import { isAuthenticate, isAuthorized } from "../../middleware/authentication.js";
import { roles } from "../../utilis/enums.js";
const  brandRouter=Router()
brandRouter.post('/',isAuthenticate(),isAuthorized([roles.ADMIN,roles.SELLER]),cloudUpload({}).single('logo'),validate(addBrandVal),asyncHandeler(addBrand))
brandRouter.get('/', asyncHandeler(getAllBrands));
brandRouter.get('/:brandId', asyncHandeler(getBrand));
brandRouter.put('/:brandId',isAuthenticate(),isAuthorized([roles.ADMIN,roles.SELLER]),cloudUpload({}).single('logo'),validate(updateBrandVal),asyncHandeler(updateBrand))
brandRouter.delete('/:brandId', asyncHandeler(deleteBrand));
export default brandRouter