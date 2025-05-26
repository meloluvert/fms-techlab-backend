import express from 'express';
import cors from 'cors';
import 'reflect-metadata';
import path from "path";
import { AppDataSource } from './database/data-source';
import { routes } from './app/routes/routes';
import dotenv from "dotenv"
dotenv.config({
    path: path.resolve(__dirname, "./env.local")
  });
  export  const secret =process.env.JWT_SECRET

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes); 

try {
    AppDataSource.initialize().then(() => {
        console.log('Ok');
        app.listen(3000, () => console.log("Servidor rodando na porta 3000"));
    });
} catch (error) {
    console.error(error);
    throw new Error("Unable to connect to DB");
}