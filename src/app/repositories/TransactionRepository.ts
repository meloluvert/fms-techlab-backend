import { AppDataSource } from "../../database/data-source";
import { Transaction } from "../entities/Transaction";
import { userRepository } from "./UserRepository";
import { Account } from "../entities/Account";
import { accountRepository } from "./AccountRepository";
import { ITransaction } from "../interfaces/interfaces";
export const transactionRepository = AppDataSource.getRepository(Transaction);
const newTransaction = async ({
  amount,
  description,
  sourceAccount,
  destinationAccount
}: ITransaction): Promise<Transaction> => {
  const destination = await accountRepository.findOneBy({
    id: destinationAccount.id,
  });

  let origin = null;
  if (sourceAccount && sourceAccount.id) {
    origin = await accountRepository.findOneBy({ id: sourceAccount.id });
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

  // Para saldo inicial, apenas credita na conta destino
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


//validar se transaction foi feita

//pega o id do usuário e faz uma realção gigantesta para pegar:
// Se tiver user_id, lembre-se que o usuário não tem relação com a transação, mas sim com as contas, então vai ter que fazer uns "join" para chegar lá... ou seja pega transacoes com id das contas do usuário....

//se tiver account_id, confirma se a conta é do usuário e retorna transações com aquela conta
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
    withDeleted: true, // para garantir que contas soft-deleted sejam carregadas
  });

  if (!user) {
    throw new Error("Usuário não encontrado");
  }

  const accountIds = user.accounts.map((acc) => acc.id);

  if (account_id) {
    // Confirma se a conta pertence ao usuário
    if (!accountIds.includes(account_id)) {
      throw new Error("A conta não pertence a este usuário");
    }

    return await transactionRepository
      .createQueryBuilder("transaction")
      .leftJoinAndSelect("transaction.originAccount", "origin")
      .leftJoinAndSelect("transaction.destinationAccount", "dest")
      .withDeleted() // Inclui soft-deleted nas contas relacionadas
      .where("origin.id = :account_id OR dest.id = :account_id", { account_id })
      .orderBy("transaction.created_at", "DESC")
      .getMany();
  }

  return await transactionRepository
    .createQueryBuilder("transaction")
    .leftJoinAndSelect("transaction.originAccount", "origin")
    .leftJoinAndSelect("transaction.destinationAccount", "dest")
    .withDeleted() // Inclui soft-deleted nas contas relacionadas
    .where("origin.id IN (:...ids) OR dest.id IN (:...ids)", {
      ids: accountIds,
    })
    .orderBy("transaction.created_at", "DESC")
    .getMany();
};

export { newTransaction, getTransactions };
