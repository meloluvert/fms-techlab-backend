import { Request, Response, Router } from "express";
import {User} from "../entities/User"
import {getUser} from "../repositories/UserRepository"

import IUser from "../interfaces/IUser"

const userRouter =  Router();
userRouter.get("/perfil", async ()=>{
    const user = await getUser()

})