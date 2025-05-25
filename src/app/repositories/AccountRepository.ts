import { AccountType } from "../entities/AccountTypes"; // certifique-se de importar
import { IAccount, IAccountType } from "../interfaces/interfaces";
import { Account } from "../entities/Account";
import { AppDataSource } from "../../database/data-source";
import { userRepository } from "./UserRepository";
import { getTransactions } from "./TransactionRepository";
import { getType } from "./AccountTypesRepository";
export const accountRepository = AppDataSource.getRepository(Account);
const newAccount = async ({
  name,
  type_id, // esse é o ID de accountType
  balance,
  user_id,
  description,
  color,
}: IAccount): Promise<Account> => {
  const accountTypeRepository = AppDataSource.getRepository(AccountType);
  const foundType = await accountTypeRepository.findOneBy({ id: Number(type_id) });
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

 const deleteAccount = async (id: string ) =>{

  const account = await accountRepository.findOneBy({ id });
  if (!account) {
    throw new Error("Conta não encontrada ");
  }else if(account.balance != 0){
    throw new Error("Esvazie a conta ");
  }
  await accountRepository.softDelete(id);


}
//editAccount
// pega o id, o nome, a descrição, a cor, type_id e edita... preciso que você se atente a essa relação, ok, pois o type_id preisa ser do usuário...
 const editAccount = async ({
  id,
  name,
  description,
  color,
  type_id
}: IAccount): Promise<Account> => {
  const account = await accountRepository.findOne({
    where: { id },
    relations: ["user", "accountType"], // precisa da relação pra validar o user
  });

  if (!account) {
    throw new Error("Conta não encontrada");
  }

  // Buscar o novo tipo
  const accountTypeRepository = AppDataSource.getRepository(AccountType);
  const newType = await accountTypeRepository
    .createQueryBuilder("type")
    .leftJoin("type.user", "user")
    .where("type.id = :typeId", { typeId: type_id })
    .andWhere("user.id = :userId OR user.id IS NULL", { userId: account.user.id })
    .getOne();

  if (!newType) {
    throw new Error("Tipo de conta inválido para este usuário");
  }

  // Atualiza os dados
  account.name = name;
  account.description = description ?? account.description;
  account.color = color;
  account.accountType = newType;

  await accountRepository.save(account);

  return account;
};

const getAccount = async ({
  id,
  user_id,
}: {
  id: string;
  user_id: string;
}): Promise<{
  //cuidar disso depois
  name: string;
  id: string;
  balance: string;
  type: AccountType;
  updated_at?:Date;
  created_at?:Date;
  description?:string;
  color?: string;
  user_id?: string
  transactions: any[];
}> => {
  // Verifica se a conta existe e pertence ao usuário
  const account = await accountRepository.findOne({
    where: { id },
    relations: ["user", "accountType"],
  });
  console.log(account)

  if (!account) {
    throw new Error("Conta não encontrada");
  }

  if (account.user.id !== user_id) {
    throw new Error("Conta não pertence ao usuário");
  }

  const transactions = await getTransactions({ user_id, account_id: id });

  return {
    name: account.name,
  id: account.id,
  balance: String(account.balance),
  type: account.accountType,
  updated_at:account.updated_at,
  created_at:account.created_at,
  description:account.description,
  color: account.color,
  user_id: account.user.id,
    transactions: transactions,
  };
};


export {editAccount, getAccount, deleteAccount, newAccount}