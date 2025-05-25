import { Router, Request, Response } from "express";
import {
  newTransaction,
  getTransactions,
} from "../repositories/TransactionRepository";
export const transactionRouter = Router();

transactionRouter.post(
  "/transferencia/nova",

  async (req: Request, res: Response): Promise<any> => {
    const { amount, description, sourceAccount, destinationAccount } = req.body;

    if (!amount || !sourceAccount || !destinationAccount) {
      return res
        .status(400)
        .json({ message: "Todos os campos são obrigatórios" });
    }

    try {
      const user = await newTransaction({
        amount,
        description,
        sourceAccount,
        destinationAccount,
      });
      return res.status(201).json(user);
    } catch (error) {
      console.error("Erro ao transferir:", error);
      // Considere tratar erros específicos (ex: email duplicado)
      // Opcionalmente, passe o erro para um middleware de erro: next(error);
      return res.status(500).json({ message: "Erro ao transferir" });
    }
  }
);

transactionRouter.post(
  "/transferencia/historico",

  async (req: Request, res: Response): Promise<any> => {
    try {
      const { user_id, account_id } = req.body;

      const transactions = await getTransactions({
        user_id,
        account_id: account_id?.toString(),
      });

      return res.json(transactions);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }
);
