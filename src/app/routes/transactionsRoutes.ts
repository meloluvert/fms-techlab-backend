import { Router } from "express";
import transactionController from "../controllers/TransactionController";

const transactionsRouter = Router();

transactionsRouter.post("/", transactionController.create);
transactionsRouter.get("/", transactionController.index);

export default transactionsRouter;
