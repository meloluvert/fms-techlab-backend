import { Request, Response } from "express";
import {
  newType,
  getTypes,
  getType,
  editType,
  deleteType,
} from "../services/AccountTypesService";
import * as user from "../../types/index"
import { User } from "../entities/User";
async function create(req: Request, res: Response): Promise<any> {
  const { name} = req.body;
  const user_id = req.user?.id;
  if (!name) {
    return res
      .status(400)
      .json({ message: "Coloque o nome do tipo da conta!" });
  }
  try {
    const type = await newType({ name, user_id });
    return res.status(201).json(type);
  } catch (error) {
    return res.status(500).json({ message: "Erro ao criar tipo" });
  }
}

async function list(req: Request, res: Response): Promise<any> {
  const user_id = req.user?.id;
  if (!user_id) {
    return res.status(400).json({ message: "ID do usuário é obrigatório" });
  }
  try {
    const types = await getTypes(user_id);
    if (!types || types.length === 0) {
      return res.status(404).json({ message: "Nenhum tipo encontrado" });
    }
    return res.status(200).json(types);
  } catch (error) {
    console.error("Erro ao buscar tipos:", error);
    return res.status(500).json({ message: "Erro interno no servidor" });
  }
}

async function show(req: Request, res: Response): Promise<any> {
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({ message: "ID inválido" });
  }
  try {
    const type = await getType(id);
    if (!type) {
      return res.status(404).json({ message: "Tipo não encontrado" });
    }
    return res.status(200).json(type);
  } catch (error) {
    console.error("Erro ao buscar tipo:", error);
    return res.status(500).json({ message: "Erro interno no servidor" });
  }
}

async function update(req: Request, res: Response): Promise<any> {
  const id = req.params.id;
  const { name } = req.body;
  if (!id) {
    return res.status(400).json({ message: "ID inválido" });
  }
  if (!name) {
    return res.status(400).json({ message: "Nome é obrigatório" });
  }
  try {
    const type = await editType({ id, name });
    return res.status(200).json(type);
  } catch (error) {
    console.error("Erro ao editar tipo:", error);
    return res.status(500).json({ message: "Erro ao editar tipo" });
  }
}
async function remove(req: Request, res: Response): Promise<any> {
  const user_id = req.user?.id;
  const id = req.params.id;

  if (!id) {
    return res.status(400).json({ message: "ID inválido" });
  }

  if (!user_id) {
    return res.status(400).json({ message: "ID do usuário é obrigatório" });
  }

  try {
    const types = await getTypes(user_id);

    if (!types || types.length === 0) {
      return res.status(404).json({ message: "Nenhum tipo encontrado" });
    }

    const type = types.find((t) => t.id === id);
    if (!type) {
      return res.status(404).json({ message: "Tipo não encontrado" });
    }

    const isUniversal = !type.user || type.user.length === 0;
    const isUserType = type.user.some((user: any) => user.id === user_id);

    if (isUniversal) {
      return res.status(403).json({ message: "Não é permitido deletar tipo universal." });
    }

    if (!isUserType) {
      return res.status(403).json({ message: "Você só pode deletar tipos que são seus." });
    }

    await deleteType(id);

    return res.status(200).json({ message: "Tipo de Conta deletado com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar tipo:", error);
    return res.status(500).json({ message: "Erro interno no servidor" });
  }
}


export default {
  create,
  show,
  remove,
  update,
  list,
};
