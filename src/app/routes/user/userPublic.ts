import { Router } from "express";
import { loginUser, registerUser } from "../../controllers/UserController";

const userRouterPublic = Router();

userRouterPublic.post("/login", loginUser);
userRouterPublic.post("/register", registerUser);

export {userRouterPublic};
