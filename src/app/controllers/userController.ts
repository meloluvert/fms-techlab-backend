import { Router, Request, Response } from "express";
import { getUser, newUser } from "../repositories/UserRepository";
const userRouter = Router();

// Rota GET para buscar um usuário
userRouter.post( "/perfil", async (req: Request, res: Response): Promise<any> => {
    const { id } = req.body;
    if (!id || typeof id !== "string") {
      return res.status(400).json({ message: "ID do usuário inválido ou ausente" });
    }
    try {
      const user = await getUser(id);
      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }
      return res.status(200).json(user);
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
      return res.status(500).json({ message: "Erro interno no servidor" });
    }
  }
);

userRouter.post(
  "/cadastro",
  // Tipagem explícita: Request<Params, ResBody, ReqBody, ReqQuery>
  async (req: Request, res: Response): Promise<any> => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Todos os campos são obrigatórios" });
    }

    try {
      const user = await newUser({ name, email, password });
      return res.status(201).json(user);
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      // Considere tratar erros específicos (ex: email duplicado)
      // Opcionalmente, passe o erro para um middleware de erro: next(error);
      return res.status(500).json({ message: "Erro ao criar usuário" });
    }
  }
);
export { userRouter };
