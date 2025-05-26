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
import { authMiddleware } from "../middlewares/auth";
import { json } from "stream/consumers";
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
// backend: userRouter.ts
userRouter.get(
  "/perfil",
  async (req: Request, res: Response): Promise<any> => {
    const { id } = req.user;
    console.log("id do usuário  :",id) // ELE ENTRA AQUI!! O QUE PODE SER??
    if (!id || typeof id !== "string") {
      return res
        .status(400)
        .json({ message: "ID do usuário inválido ou ausente" });
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
);


userRouter.post(
  "/edit",
  // Tipagem explícita: Request<Params, ResBody, ReqBody, ReqQuery>
  async (req: Request, res: Response): Promise<any> => {
    const { name, password} = req.body;
    const{id, email} = req.user

    if (!name && !email && !password) {
      return res
        .status(400)
        .json({ message: "Para EDITAR, é necessário mudar algo!" });
    }
    if (!id) {
      console.log("Id não fornecido");
    }

    try {
      const user = await editUser({ name, email, password, id });
      return res.status(201).json(user);
    } catch (error) {
      console.error("Erro ao editar usuário:", error);
      // Considere tratar erros específicos (ex: email duplicado)
      // Opcionalmente, passe o erro para um middleware de erro: next(error);
      return res.status(500).json({ message: "Erro ao editar usuário" });
    }
  }
);

userRouter.post(
  "/delete",
  async (req: Request, res: Response): Promise<any> => {
    const { id } = req.body;

    if (!id) {
      console.log("Id não fornecido");
    }

    try {
      const user = await deleteUser(id);
      return res.status(201).json({ message: "Usuário deletado com sucesso" });
    } catch (error) {
      console.error("Erro ao deletar usuário:", error);
      // Considere tratar erros específicos (ex: email duplicado)
      // Opcionalmente, passe o erro para um middleware de erro: next(error);
      return res.status(500).json({ message: "Erro ao deletar usuário" });
    }
  }
);
export { userRouter };
