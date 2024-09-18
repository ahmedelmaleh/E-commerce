import { Router } from "express";
import { isAuthenticate, isAuthorized } from "../../middleware/authentication.js";
import { cloudUpload } from "../../fileupload/fileupload-cloud.js";
import { asyncHandeler } from "../../utilis/asyncHandler.js";
import { addUser, deleteUser, getAllUsers, getUser, updateUser } from "./admin.controller.js";
import { roles } from "../../utilis/enums.js";
const adminRouter=Router()
adminRouter.post("/adduser",isAuthenticate(),isAuthorized([roles.ADMIN,roles.SELLER]),cloudUpload({}).single("image"),asyncHandeler(addUser))
adminRouter.get("/", isAuthenticate(), isAuthorized([roles.ADMIN]), asyncHandeler(getAllUsers));
adminRouter.get("/:userId", isAuthenticate(), isAuthorized([roles.ADMIN]), asyncHandeler(getUser));
adminRouter.put("/:userId", isAuthenticate(), isAuthorized([roles.ADMIN]), cloudUpload({}).single("image"), asyncHandeler(updateUser));
adminRouter.delete("/:userId", isAuthenticate(), isAuthorized([roles.ADMIN]), asyncHandeler(deleteUser));
export default adminRouter