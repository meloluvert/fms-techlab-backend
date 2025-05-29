import { AppDataSource } from "../../database/data-source";
import { User } from "../entities/User";
import { Transaction } from "../entities/Transaction";
import { AccountType } from "../entities/AccountTypes";
import { Account } from "../entities/Account";
export const userRepository = AppDataSource.getRepository(User);

export const transactionRepository = AppDataSource.getRepository(Transaction);

export const accountTypesRepository = AppDataSource.getRepository(AccountType);

export const accountRepository = AppDataSource.getRepository(Account);