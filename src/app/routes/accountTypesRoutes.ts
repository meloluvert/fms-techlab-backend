import { Router } from "express";

import accountTypesController from "../controllers/AccountTypeController"

const accountTypesRouter = Router();

accountTypesRouter.post("/", accountTypesController.create);
accountTypesRouter.get("/", accountTypesController.list);
accountTypesRouter.get("/:id", accountTypesController.show);
accountTypesRouter.put("/:id", accountTypesController.update);
accountTypesRouter.delete("/:id", accountTypesController.remove);

export default accountTypesRouter;
