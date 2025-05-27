import { Router } from "express";
import userController from "../../controllers/UserController";

const userRouterPrivate = Router();

userRouterPrivate.get("/", userController.show); // GET /user
userRouterPrivate.put("/",  userController.update); // PUT /user
userRouterPrivate.delete("/", userController.remove); // DELETE /user

export default userRouterPrivate;
