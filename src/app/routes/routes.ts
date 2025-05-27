import { Router } from "express";
import  accountTypeRouter from "./accountTypesRoutes";
import accountRouter from "./accountRoutes";
import transactionRouter from "./transactionsRoutes";
import { authMiddleware } from "../middlewares/auth";
import { userRouterPublic } from "../routes/user/userPublic";
import userRouterPrivate from "./user/userPrivate";
const routes = Router();

// rotas públicas
routes.use("/user", userRouterPublic);

// aplica middleware
routes.use(authMiddleware);

// rotas protegidas
routes.use("/user", userRouterPrivate);
routes.use("/accounts", accountRouter);
routes.use("/transactions", transactionRouter);
routes.use("/account-types", accountTypeRouter);

export default routes;

export { routes };
