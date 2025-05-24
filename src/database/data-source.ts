import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "../app/entities"
import { CreateUsers } from "../migrations"
import { Account } from "../app/entities/Account"
import { AccountType } from "../app/entities/AccountTypes"
import { Transaction } from "../app/entities/Transaction"
export const AppDataSource = new DataSource({
    type: "sqlite",
    database: "./src/database/db.sqlite",
    synchronize: true,
    logging: false,
    entities: [User,AccountType ,Account, Transaction],
    migrations: [CreateUsers],
    subscribers: [],
})
