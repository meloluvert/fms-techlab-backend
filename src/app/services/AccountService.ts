import { AccountType } from "../entities/AccountTypes"; // certifique-se de importar
import { IAccount, IAccountType } from "../interfaces/interfaces";
import { Account } from "../entities/Account";
import {
  userRepository,
  accountTypesRepository,
  accountRepository,
} from "../repositories";
import { getTransactions, newTransaction } from "./TransactionService";

import { formatMoney, formatDate } from "../../utils/formatter";
const newAccount = async ({
  name,
  type_id,
  balance,
  user_id,
  description,
  color,
}: IAccount): Promise<Account> => {
  const foundType = await accountTypesRepository.findOneBy({ id: type_id });
  const foundUser = await userRepository.findOneBy({ id: user_id });

  if (!foundUser) throw new Error("Usuário inválido");
  if (!foundType) throw new Error("Tipo de conta não encontrado");

  const account = accountRepository.create({
    accountType: foundType,
    user: foundUser,
    description,
    balance: 0,
    color,
    name,
  });

  await accountRepository.save(account);

  if (Number(balance) > 0) {
    await newTransaction({
      amount: Number(balance),
      description: "Saldo inicial",
      destinationAccount: { id: account.id },
    });
  }
  return account;
};

const deleteAccount = async (id: string) => {
  const account = await accountRepository.findOneBy({ id });
  if (!account) {
    throw new Error("Conta não encontrada ");
  } else if (account.balance != 0) {
    throw new Error("Esvazie a conta ");
  }
  await accountRepository.softDelete(id);
};
const editAccount = async ({
  id,
  name,
  description,
  balance,
  color,
  type_id,
}: IAccount): Promise<Account> => {
  const account = await accountRepository.findOne({
    where: { id },
    relations: ["user", "accountType"], // precisa da relação pra validar o user
  });

  if (!account) {
    throw new Error("Conta não encontrada");
  }

  const newType = await accountTypesRepository
    .createQueryBuilder("type")
    .leftJoinAndSelect("type.user", "user")
    .where("type.id = :typeId", { typeId: type_id })
    .getOne();

  if (!newType) {
    throw new Error("Tipo não encontrado");
  }

  const isUniversal = !newType.user || newType.user.length === 0;
  const belongsToUser = newType.user.some((u) => u.id === account.user.id);

  if (!isUniversal && !belongsToUser) {
    throw new Error("Tipo de conta não pertence a este usuário");
  }

  if (!newType) {
    throw new Error("Tipo de conta inválido para este usuário");
  }

  // Atualiza os dados
  account.name = name;
  account.description = description ?? account.description;
  account.color = color;
  account.accountType = newType;

  await accountRepository.save(account);
  if (account.balance != Number(balance)) {
    if (account.balance > Number(balance)) {
      await newTransaction({
        amount: account.balance - Number(balance),
        description: "",
        originAccount: { id: account.id },
      });
    } else {
      await newTransaction({
        amount: Number(balance) - account.balance,
        description: "",
        destinationAccount: { id: account.id },
      });
    }
  }

  return account;
};

const getAccount = async ({
  id,
  user_id,
}: {
  id: string;
  user_id: string;
}): Promise<{
  name: string;
  id: string;
  balance: string;
  type: AccountType;
  updated_at?: string | null;
  created_at?: string | null;
  description?: string;
  color?: string;
  user_id?: string;
  transactions: any[];
}> => {
  const account = await accountRepository.findOne({
    where: { id },
    relations: ["user", "accountType"],
  });

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
    balance: formatMoney(account.balance),
    type: account.accountType,
    updated_at: formatDate(account.updated_at as Date),
    created_at: formatDate(account.created_at as Date),
    description: account.description,
    color: account.color,
    user_id: account.user.id,
    transactions,
  };
};

const listAccounts = async (user_id: string): Promise<Array<IAccount>> => {
  const accounts = await accountRepository.find({
    where: { user: { id: user_id } },
    relations: ["accountType"],
    select: {
      id: true,
      name: true,
      balance: true,
      color: true,
      description: true,
      created_at: true,
      updated_at: true,
      accountType: true,
    },
  });

  return accounts.map((account) => ({
    id: account.id,
    name: account.name,
    balance: formatMoney(account.balance),
    type: account.accountType,
    color: account.color,
    description: account.description,
    created_at: formatDate(account.created_at as Date),
    updated_at: formatDate(account.updated_at as Date),
  }));
};

export { editAccount, getAccount, deleteAccount, newAccount, listAccounts };
