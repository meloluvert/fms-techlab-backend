import { AccountType } from "../entities/AccountTypes"; // certifique-se de importar
import { IAccount } from "../interfaces/interfaces";
import { Account } from "../entities/Account";
import { AppDataSource } from "../../database/data-source";
import { userRepository } from "./UserRepository";
const accountRepository = AppDataSource.getRepository(Account);
export const newAccount = async ({
  name,
  type, // esse é o ID de accountType
  balance,
  user_id,
  description,
  color,
}: IAccount): Promise<Account> => {
  const accountTypeRepository = AppDataSource.getRepository(AccountType);
  const foundType = await accountTypeRepository.findOneBy({ id: Number(type) });
  const foundUser = await userRepository.findOneBy({ id:user_id });
  if (!foundType) {
    throw new Error("Tipo de conta não encontrado");
  }

  if (!foundUser) {
    throw new Error("usuário inválido");
  }

  const account = accountRepository.create({
  
    accountType: foundType,
    user:foundUser,
    balance: Number(balance),
    description,
    color,
    name,
  });

  await accountRepository.save(account);
  return account;
};

export const deleteAccount = async (id: string ) =>{

  const accountTypeRepository = AppDataSource.getRepository(AccountType);
  await accountRepository.softDelete(id);


}