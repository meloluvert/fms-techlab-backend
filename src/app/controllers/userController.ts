import { Router, Request, Response } from "express";
import { editUser, getUser, newUser, deleteUser } from "../repositories/UserRepository";
const userRouter = Router();


userRouter.post(
  "/usuario/novo",

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

userRouter.post( "/usuario/perfil", async (req: Request, res: Response): Promise<any> => {
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
  "/usuario/editar",
  // Tipagem explícita: Request<Params, ResBody, ReqBody, ReqQuery>
  async (req: Request, res: Response): Promise<any> => {
    const { name, email, password, id } = req.body;

    if (!name && !email && !password) {
      return res
        .status(400)
        .json({ message: "Para EDITAR, é necessário mudar algo!" });
    }
    if(!id){
      console.log("Id não fornecido")
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
  "/usuario/excluir",
  async (req: Request, res: Response): Promise<any> => {
    const {id } = req.body;

    
    if(!id){
      console.log("Id não fornecido")
    }

    try {
      const user = await deleteUser(id );
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
