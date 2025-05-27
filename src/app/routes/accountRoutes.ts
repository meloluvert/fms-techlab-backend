import { Router } from "express";
import accountController from "../controllers/AccountController";

const accountRouter = Router();

accountRouter.get("/", accountController.index);               // Listar todas as contas
accountRouter.post("/", accountController.create);             // Criar nova conta
accountRouter.get("/:id", accountController.show);             // Mostrar conta específica
accountRouter.put("/:id", accountController.update);           // Atualizar conta (substituir)
accountRouter.patch("/:id", accountController.update);         // Atualizar conta (parcial)
accountRouter.delete("/:id", accountController.remove);        // Deletar conta

export default accountRouter ;
