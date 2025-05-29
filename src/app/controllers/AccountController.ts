import { Request, Response } from "express";
import {
  newAccount,
  getAccount,
  editAccount,
  deleteAccount,
  listAccounts,
} from "../services/AccountService";

async function index(req: Request, res: Response): Promise<any> {
  const user_id = req.user.id; // Supondo que o user_id vem do token JWT

  try {
    const accounts = await listAccounts(user_id);
    return res.status(200).json(accounts);
  } catch (error) {
    console.error("Erro ao listar contas:", error);
    return res.status(500).json({ message: "Erro ao listar contas" });
  }
}

async function create(req: Request, res: Response): Promise<any> {
  const { name, description, color, type_id, balance } = req.body;
  const user_id = req.user.id;

  if (!name || !type_id) {
    return res
      .status(400)
      .json({ message: "Preencha o tipo E o nome da conta" });
  }

  try {
    const account = await newAccount({
      name,
      description,
      type_id,
      color,
      balance,
      user_id,
    });
    return res.status(201).json(account);
  } catch (error) {
    console.error("Erro ao criar conta:", error);
    return res.status(500).json({ message: "Erro ao criar conta" });
  }
}

async function show(req: Request, res: Response): Promise<any> {
  const { id } = req.params;
  const user_id = req.user.id; // se precisar validar usuário

  if (!id) {
    return res.status(400).json({ message: "Id da conta inexistente" });
  }

  try {
    const account = await getAccount({ id, user_id });
    return res.status(200).json(account);
  } catch (error) {
    console.error("Erro ao buscar conta:", error);
    return res.status(500).json({ message: "Erro ao buscar conta" });
  }
}

async function update(req: Request, res: Response): Promise<any> {
  const { id } = req.params;
  const user_id = req.user.id;
  const { name, description, color, type_id } = req.body;

  if (!name && !type_id && !description && !color) {
    return res
      .status(400)
      .json({ message: "Você precisa mandar algum dado para alterarmos" });
  }

  try {
    if (!(await getAccount({ id, user_id }))) {
      res
        .status(401)
        .json({ message: "Essa conta não é sua. Tente entrar novamente" });
    }
    const account = await editAccount({
      id,
      name,
      description,
      type_id,
      color,
    });
    return res.status(200).json(account);
  } catch (error) {
    console.error("Erro ao atualizar conta:", error);
    return res.status(500).json({ message: "Erro ao atualizar conta" });
  }
}

async function remove(req: Request, res: Response): Promise<any> {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Id da conta inexistente" });
  }

  try {
    const result = await deleteAccount(id);
    return res.status(204).send(); // 204 No Content para delete
  } catch (error) {
    console.error("Erro ao deletar conta:", error);
    return res.status(500).json({ message: "Erro ao deletar conta" });
  }
}

export default {
  index,
  create,
  show,
  update,
  remove,
};
