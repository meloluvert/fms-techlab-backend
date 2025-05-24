import { Router, Request, Response, NextFunction } from "express";
import { Application } from "express";
import { getUser, newUser } from "../repositories/UserRepository";
import IUser from "../interfaces/IUser"; // <-- CERTIFIQUE-SE QUE ESTE CAMINHO ESTÁ CORRETO


// Interface para definir o corpo esperado na rota POST
// (Se você já tem IUser, pode usá-la diretamente)
interface NewUserBody extends IUser {}

const userRouter = Router();

// Rota GET para buscar um usuário
userRouter.get(
    "perfil/:id",
    // Tipagem explícita: Request<Params, ResBody, ReqBody, ReqQuery>
    async (req: Request, res: Response): Promise<Response | void> => {
        const { id } = req.params;

        // A tipagem já ajuda, mas uma checagem em tempo de execução é segura
        if (!id || typeof id !== 'string') {
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
            // Opcionalmente, passe o erro para um middleware de erro: next(error);
            return res.status(500).json({ message: "Erro interno no servidor" });
        }
    }
);

// Rota POST para criar novo usuário
userRouter.post(
    "/usuario",
    // Tipagem explícita: Request<Params, ResBody, ReqBody, ReqQuery>
    async (req: Request, res: Response): Promise<Response | void> => {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Todos os campos são obrigatórios" });
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