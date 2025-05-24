import 'reflect-metadata';
import cors from 'cors';
import express from 'express';
import { AppDataSource } from './database/data-source';
import routers from './app/routes/routes';
const app = express();
console.log("teste")
//returar bloqueio de requisições do front
app.use(cors());
app.use(express.json());
app.use(routers);
//projeto inicado com conexão bem sucedida,
try {
    AppDataSource.initialize().then(async ()=>{
        console.log('Ok');
        app.listen(3000, () => console.log("Servidor rodando na porta 3000"));
    })
} catch (error) {
    console.log(error)
    throw new Error("Unable to connect to DB")
}

