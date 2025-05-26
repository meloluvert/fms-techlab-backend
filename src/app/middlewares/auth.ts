import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { secret } from "../../server"; // ou process.env.SECRET

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ message: "Token não fornecido" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, secret) as { id: string; email: string };
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token inválido ou expirado" });
  }
};

