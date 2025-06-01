import { Router } from "express";
import userController from "../../controllers/UserController";

const userRouterPrivate = Router();

userRouterPrivate.get("/", userController.show); 
userRouterPrivate.put("/",  userController.update); 
userRouterPrivate.delete("/", userController.remove); 

export default userRouterPrivate;
