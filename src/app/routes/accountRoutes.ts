import { Router } from "express";
import accountController from "../controllers/AccountController";

const accountRouter = Router();

accountRouter.get("/", accountController.index);               
accountRouter.post("/", accountController.create);           
accountRouter.get("/:id", accountController.show);             
accountRouter.put("/:id", accountController.update);          
accountRouter.delete("/:id", accountController.remove);        

export default accountRouter ;
