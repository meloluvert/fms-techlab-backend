import { Router, Request, Response } from "express";
import { newType, getType } from "../repositories/AccountTypesRepository";
import { deleteAccount, newAccount } from "../repositories/AccountRepository";

export const accountRouter = Router();
accountRouter.post(
    "/conta/nova",
    // Tipagem explícita: Request<Params, ResBody, ReqBody, ReqQuery>
    async (req: Request, res: Response): Promise<any> => {
      const { name,description, color, type, balance, user_id  } = req.body;
  
      if (!name || !type) {
        return res
          .status(400)
          .json({ message: "Preencha ao menos o tipo e o nome da conta" });
      }
  
      try {
        const user = await newAccount({ name,description, type, color, balance, user_id});
        return res.status(201).json(user);
      } catch (error) {
        console.error("Erro ao criar conta:", error);
        // Considere tratar erros específicos (ex: email duplicado)
        // Opcionalmente, passe o erro para um middleware de erro: next(error);
        return res.status(500).json({ message: "Erro ao criar usuário" });
      }
    }
  );


  accountRouter.post(
    "/conta/excluir",
    // Tipagem explícita: Request<Params, ResBody, ReqBody, ReqQuery>
    async (req: Request, res: Response): Promise<any> => {
      const { id } = req.body;
  
      if (!id) {
        return res
          .status(400)
          .json({ message: "Id da conta inexistente" });
      }
  
      try {
        const user = await deleteAccount(id);
        return res.status(201).json(user);
      } catch (error) {
        console.error("Erro ao deletar conta: ", error);
        // Considere tratar erros específicos (ex: email duplicado)
        // Opcionalmente, passe o erro para um middleware de erro: next(error);
        return res.status(500).json({ message: "Erro ao deletar conta" });
      }
    }
  );