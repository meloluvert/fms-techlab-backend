import { Router } from "express";
import {userRouter} from "../controllers/userController";
import { accountTypeRouter } from "../controllers/accountTypeController";
import { accountRouter } from "../controllers/accountController";
import { transactionRouter } from "../controllers/transactionController";
const routes = Router();

// If you want user routes to be under '/users', do this:
routes.use(userRouter); // MUDANÇA AQUI: Adicione o prefixo desejado
routes.use(accountTypeRouter); 
routes.use(accountRouter)
routes.use(transactionRouter);

export { routes };