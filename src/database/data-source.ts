import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "../app/entities"
import { CreateUsers } from "../migrations"
export const AppDataSource = new DataSource({
    type: "sqlite",
    database: "./src/database/db.sqlite",
    synchronize: true,
    logging: false,
    entities: [User],
    migrations: [CreateUsers],
    subscribers: [],
})
