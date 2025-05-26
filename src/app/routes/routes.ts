import { Router } from "express";
import {userRouter} from "../controllers/userController";
import { accountTypeRouter } from "../controllers/accountTypeController";
import { accountRouter } from "../controllers/accountController";
import { transactionRouter } from "../controllers/transactionController";
const routes = Router();


routes.use(userRouter);
routes.use(accountTypeRouter); 
routes.use(accountRouter)
routes.use(transactionRouter);

export { routes };