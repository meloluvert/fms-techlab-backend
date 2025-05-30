import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../app/entities/User";
import { AccountType } from "../app/entities/AccountTypes";
import { Account } from "../app/entities/Account";
import { Transaction } from "../app/entities/Transaction";
import { StandardTypes } from "../migrations";
import * as dotenv from "dotenv";

dotenv.config();

const commonConfig = {
  synchronize: true,
  logging: false,
  entities: [User, AccountType, Account, Transaction],
  migrations: [StandardTypes],
  subscribers: [],
};

let dataSource: DataSource;

if (process.env.DB_TYPE === "postgres") {
  dataSource = new DataSource({
    type: "postgres",
    url: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    ...commonConfig,
  });
} else {
  dataSource = new DataSource({
    type: "sqlite",
    database: "./src/database/db.sqlite",
    ...commonConfig,
  });
}

export const AppDataSource = dataSource;
