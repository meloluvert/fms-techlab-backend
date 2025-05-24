import express from 'express';
import cors from 'cors';
import 'reflect-metadata';
import { AppDataSource } from './database/data-source';
import { routes } from './app/routes/routes'; // Keep this import
// import { userRouter } from './app/controllers/userController'; // REMOVA ESTA LINHA

const app = express();

app.use(cors());
app.use(express.json());
app.use('/', routes); // Use the main 'routes' router. Your 'userRouter' is already included in 'routes'.
// app.use('/users', userRouter); // REMOVA OU COMENTE ESTA LINHA - ESTA É A DUPLICAÇÃO/PROBLEMA POTENCIAL

try {
    AppDataSource.initialize().then(() => {
        console.log('Ok');
        app.listen(3000, () => console.log("Servidor rodando na porta 3000"));
    });
} catch (error) {
    console.error(error);
    throw new Error("Unable to connect to DB");
}