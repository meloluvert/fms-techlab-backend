import { Router, Request, Response } from "express";
import { secret } from "../../server";

import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import {
  editUser,
  getUser,
  newUser,
  deleteUser,
  getUserWithPassword,
} from "../repositories/UserRepository";
const userRouter = Router();

export const loginUser = async (req: Request, res: Response): Promise<any> => {
  const { password, email } = req.body;
  console.log("tentativa de log in ", email)

  if (!email || !password) {
    return res.status(400).json({ message: "Email e senha são obrigatórios" });
  }

  try {
    // Busca o usuário COM a senha (apenas para login)
    const userWithPassword = await getUserWithPassword(email);

    if (!userWithPassword) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }
    // Compara a senha do body com o hash do banco
    const passwordMatch = bcrypt.compareSync(
      password,
      userWithPassword.password
    );
    if (!passwordMatch) {
      return res.status(401).json({ message: "Credenciais inválidas" });
    }

    // Busca o usuário SEM a senha para retornar no response
    const user = await getUser(userWithPassword.id);

    // Gera o token JWT
    const token = jwt.sign({ id: user.id, email: user.email }, secret, {
      expiresIn: "24h",
    });

    return res.json({ token, user });
  } catch (error) {
    console.error("Erro no login:", error);
    return res.status(500).json({ message: "Erro interno no servidor" });
  }
};

export const registerUser = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "Todos os campos são obrigatórios" });
  }

  try {
    const user = await newUser({
      name,
      email,
      password: bcrypt.hashSync(password, 10),
    });

    const token = jwt.sign({ id: user.id, email: user.email }, secret, {
      expiresIn: "24h",
    });
    return res.status(201).json({ token, user });
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    return res.status(500).json({ message: "Erro ao criar usuário" });
  }
};


// PUT /user - atualiza dados do usuário autenticado
export async function update(req: Request, res: Response): Promise<any> {
  const { name, email, password, newPassword } = req.body;
  const { id } = req.user;

  if (!id) {
    return res.status(400).json({ message: "ID do usuário ausente" });
  }

  // Verifica se pelo menos um campo para atualizar foi enviado
  if (!name && !email && !password && !newPassword) {
    return res.status(400).json({ message: "Para editar, é necessário mudar algo!" });
  }

  try {
    // Se o usuário quer alterar a senha, deve enviar a senha atual (password) e a nova senha (newPassword)
    let hashedNewPassword: string | undefined = undefined;
    if (newPassword) {
      if (!password) {
        return res.status(400).json({ message: "Senha atual é necessária para alterar a senha." });
      }
      // Aqui você pode verificar se a senha atual está correta, por exemplo:
      // const userFromDb = await findUserById(id);
      // const isPasswordValid = bcrypt.compareSync(password, userFromDb.passwordHash);
      // if (!isPasswordValid) return res.status(401).json({ message: "Senha atual incorreta." });

      // Hash da nova senha
      hashedNewPassword = bcrypt.hashSync(newPassword, 10);
    }

    // Chama a função para editar usuário, passando os dados
    const updatedUser = await editUser({
      id,
      name,
      email,
      password: hashedNewPassword, // já com hash
    });

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Erro ao editar usuário:", error);
    return res.status(500).json({ message: "Erro ao editar usuário" });
  }
}

// GET /user - retorna os dados do usuário autenticado
async function show(req: Request, res: Response): Promise<any> {
  const { id } = req.user;
  if (!id || typeof id !== "string") {
    return res.status(400).json({ message: "ID do usuário inválido ou ausente" });
  }
  try {
    const user = await getUser(id);
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }
    return res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    return res.status(500).json({ message: "Erro interno no servidor" });
  }
}


// DELETE /user - exclui o usuário autenticado
async function remove(req: Request, res: Response): Promise<any> {
  const { id } = req.user;
  if (!id) {
    return res.status(400).json({ message: "ID do usuário ausente" });
  }
  try {
    await deleteUser(id);
    return res.status(200).json({ message: "Usuário deletado com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar usuário:", error);
    return res.status(500).json({ message: "Erro ao deletar usuário" });
  }
}

export default {
  show,
  update,
  remove,
};