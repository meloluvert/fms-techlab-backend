import 'reflect-metadata';
import cors from 'cors';
import express from 'express';
import { AppDataSource } from './database/data-source';

const app = express();
//returar bloqueio de requisições do front
app.use(cors());
app.use(express.json());
//projeto inicado com conexão bem sucedida
AppDataSource.initialize().then(async ()=>{
    console.log('Ok');
    app.listen(3000, () => console.log("Servidor rodando na porta 3000"));
})
