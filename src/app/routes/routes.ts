import { Router } from "express";
import {userRouter} from "../controllers/userController";
import { accountTypeRouter } from "../controllers/accountTypeController";
import { accountRouter } from "../controllers/accountController";
import { transactionRouter } from "../controllers/transactionController";
import { authMiddleware } from "../middlewares/auth";
import { userRouterPublic } from "./userPublic";
const routes = Router();

// rotas públicas
routes.use("/user", userRouterPublic);

// aplica middleware
routes.use(authMiddleware);

// rotas protegidas
routes.use("/user", userRouter);
routes.use("/accounts", accountRouter);
routes.use("/transactions", transactionRouter);
routes.use("/account-types", accountTypeRouter);

export default routes;


export { routes };