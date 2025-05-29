import { Request, Response } from "express";
import {
  newTransaction,
  getTransactions,
} from "../services/TransactionService";

async function create(req: Request, res: Response): Promise<any> {
  const { amount, description, sourceAccount, destinationAccount } = req.body;
  const user_id = req.user.id;
  if (!amount || !sourceAccount) {
    return res.status(400).json({ message: "Campos obrigatórios faltando" });
  }
  if (!user_id) {
    return res.status(400).json({ message: "Falta usuário" });
  }

  try {
    const transaction = await newTransaction({
      amount,
      description,
      sourceAccount,
      destinationAccount,
    });
    return res.status(201).json(transaction);
  } catch (error) {
    console.error("Erro ao criar transação:", error);
    return res.status(500).json({ message: "Erro ao criar transação" });
  }
}

// GET /transactions?user_id=...&account_id=...
async function index(req: Request, res: Response): Promise<any> {
  try {
    const { account_id } = req.query;
    const user_id = req.user.id;

    const transactions = await getTransactions({
      user_id: user_id as string,
      account_id: account_id ? String(account_id) : undefined,
    });

    return res.status(200).json(transactions);
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
}

export default {
  create,
  index,
};
