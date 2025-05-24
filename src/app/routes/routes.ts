import { Router } from "express";
import { userRouter } from "../controllers/userController";

const routes = Router();

// If you want user routes to be under '/users', do this:
routes.use("/", userRouter); // MUDANÇA AQUI: Adicione o prefixo desejado

export { routes };