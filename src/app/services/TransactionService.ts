import { AppDataSource } from "../../database/data-source";
import { Transaction } from "../entities/Transaction";
import { userRepository } from "../repositories";
import { Account } from "../entities/Account";
import { accountRepository } from "../repositories";
import { ITransaction } from "../interfaces/interfaces";
import { formatMoney, formatDate } from "../../utils/formatter";
import { transactionRepository } from "../repositories";
const newTransaction = async ({
  amount,
  description,
  originAccount,
  destinationAccount,
}: ITransaction): Promise<Transaction> => {
  const destination = await accountRepository.findOneBy({
    id: destinationAccount.id,
  });

  let origin = null;
  if (originAccount && originAccount.id) {
    origin = await accountRepository.findOneBy({ id: originAccount.id });
    if (!origin) throw new Error("Conta de origem não encontrada");
    if (origin.balance - Number(amount) < 0) {
      throw new Error("Saldo insuficiente");
    }
    if (amount == 0) {
      throw new Error("É necessário transferir algum valor");
    }
    origin.balance = Number(origin.balance) - Number(amount);
    await accountRepository.save(origin);
  }

  destination.balance = Number(amount) + Number(destination.balance);
  await accountRepository.save(destination);

  const transaction = transactionRepository.create({
    amount,
    destinationAccount: destination,
    originAccount: origin,
    description: description,
    originBalance: origin ? origin.balance : null,
    destinationBalance: destination.balance,
  });
  await transactionRepository.save(transaction);
  return transaction;
};

const getTransactions = async ({
  user_id,
  account_id,
}: {
  user_id: string;
  account_id?: string;
}): Promise<Transaction[]> => {
  const user = await userRepository.findOne({
    where: { id: user_id },
    relations: ["accounts"],
  });

  if (!user) {
    throw new Error("Usuário não encontrado");
  }


  const accountIds = user.accounts.map((acc) => acc.id);

  const transactions = await transactionRepository
    .createQueryBuilder("transaction")
    .leftJoinAndSelect("transaction.originAccount", "origin")
    .leftJoinAndSelect("transaction.destinationAccount", "dest")
    .addSelect([
      "transaction.originAccountId",
      "transaction.destinationAccountId",
    ]) // seleciona os ids das contas
    .withDeleted()
    .where(
      account_id
        ? "origin.id = :account_id OR dest.id = :account_id"
        : "origin.id IN (:...ids) OR dest.id IN (:...ids)",
      account_id ? { account_id } : { ids: accountIds }
    )
    .orderBy("transaction.created_at", "DESC")
    .getMany();

  for (const t of transactions) {
    if (!t.originAccount && t.originAccountId) {
      const originAccountWithDeleted = await accountRepository.findOne({
        where: { id: t.originAccountId },
        withDeleted: true,
      });
      if (originAccountWithDeleted) t.originAccount = originAccountWithDeleted;
    }
    if (!t.destinationAccount && t.destinationAccountId) {
      const destAccountWithDeleted = await accountRepository.findOne({
        where: { id: t.destinationAccountId },
        withDeleted: true,
      });
      if (destAccountWithDeleted) t.destinationAccount = destAccountWithDeleted;
    }

    t.amount = formatMoney(t.amount);
    t.created_at = formatDate(t.created_at as Date);
    if (t.originBalance !== undefined)
      t.originBalance = formatMoney(t.originBalance);
    if (t.destinationBalance !== undefined)
      t.destinationBalance = formatMoney(t.destinationBalance);
  }

  return transactions;
};

export { newTransaction, getTransactions };
