import { Router } from "express";

import { userRouter } from "../controllers/userController"; 

const routers = Router()
routers.use('/perfil/:id', userRouter)

export default routers;