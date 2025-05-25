import { Router, Request, Response } from "express";
import { newType, getTypes, deleteType, editType, getType } from "../repositories/AccountTypesRepository";
export const accountTypeRouter = Router();
accountTypeRouter.post(
    "/conta/tipo/novo",
    // Tipagem explícita: Request<Params, ResBody, ReqBody, ReqQuery>
    async (req: Request, res: Response): Promise<any> => {
      const { name, user_id } = req.body;
  
      if (!name) {
        return res
          .status(400).json({ message: "Coloque o nome do tipo da conta!" });
      }
  
      try {
        const type = await newType({ name, user_id});
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
  accountTypeRouter.post( 
    "/conta/tipos", async (req: Request, res: Response): Promise<any> => {
    const { user_id } = req.body;
    if (!user_id) {
      return res.status(400).json({ message: "ID do tipo da conta inválido" });
    }
    try {
      const type = await getTypes(user_id);
      if (!type) {
        return res.status(404).json({ message: "tipo não encontrado" });
      }
      return res.status(200).json(type);
    } catch (error) {
      console.error("Erro ao buscar tipo:", error);
      return res.status(500).json({ message: "Erro interno no servidor" });
    }
  }
);

accountTypeRouter.post(
  "/conta/tipo/editar",
  async (req: Request, res: Response): Promise<any> => {
    const { name, id } = req.body;

    if (!name ) {
      return res
        .status(400)
        .json({ message: "Passe o nome a ser editado" });
    }
    if(!id){
      console.log("Id não fornecido")
    }

    try {
      const type = await editType({id:Number(id),  name:name });
      return res.status(201).json(type);
    } catch (error) {
      console.error("Erro ao editar tipo:", error);
      // Considere tratar erros específicos (ex: email duplicado)
      // Opcionalmente, passe o erro para um middleware de erro: next(error);
      return res.status(500).json({ message: "Erro ao editar tipo" });
    }
  }
);

accountTypeRouter.post( "/conta/tipo/excluir", async (req: Request, res: Response): Promise<any> => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ message: "ID do tipo da conta inválido" });
  }
  try {
    const type = await getType(Number(id));
    if (!type) {
      return res.status(404).json({ message: "Tipo não encontrado" });
    }
    await deleteType(Number(id));
    return res.status(200).json({ message: "Tipo de Conta Deletado com sucesso" });
  } catch (error) {
    console.error("Erro ao buscar tipo:", error);
    return res.status(500).json({ message: "Erro interno no servidor" });
  }
}
);
  export default { accountTypeRouter };