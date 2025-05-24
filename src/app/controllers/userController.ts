import { Router, Request, Response } from "express";
import { getUser } from "../repositories/UserRepository";

const userRouter = Router();

// userRouter.get("/perfil/:id", async (req: Request, res: Response): Promise<Response> => {
//     const user = await getUser(Number(req.params.id));
//     return res.status(200).json(user);
//   });
  

export { userRouter }; // <- exportação nomeada
