import { Router, Request, Response } from "express";
import { newType, getType } from "../repositories/AccountTypesRepository";
export const accountTypeRouter = Router();
accountTypeRouter.post(
    "/conta/tipo/novo",
    // Tipagem explícita: Request<Params, ResBody, ReqBody, ReqQuery>
    async (req: Request, res: Response): Promise<any> => {
      const { name } = req.body;
  
      if (!name) {
        return res
          .status(400).json({ message: "Coloque o nome do tipo da conta!" });
      }
  
      try {
        const type = await newType({ name});
        return res.status(201).json(type);
      } catch (error) {
        console.error("Erro ao criar tipo: ", error);
        // Considere tratar erros específicos (ex: email duplicado)
        // Opcionalmente, passe o erro para um middleware de erro: next(error);
        return res.status(500).json({ message: "Erro ao criar tipo" });
      }
    }
  );
/*ver tipo pelo id*/
  accountTypeRouter.post( "/conta/tipo", async (req: Request, res: Response): Promise<any> => {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ message: "ID do tipo da conta inválido" });
    }
    try {
      const user = await getType(Number(id));
      if (!user) {
        return res.status(404).json({ message: "tipo não encontrado" });
      }
      return res.status(200).json(user);
    } catch (error) {
      console.error("Erro ao buscar tipo:", error);
      return res.status(500).json({ message: "Erro interno no servidor" });
    }
  }
);
  export default { accountTypeRouter };