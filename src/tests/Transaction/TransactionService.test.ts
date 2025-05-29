// __tests__/transactionService.test.ts

import { newTransaction, getTransactions } from "../../app/services/TransactionService";
import { userRepository, accountRepository, transactionRepository } from "../../app/repositories";
import { formatMoney, formatDate } from "../../utils/formatter";
import * as repositoryModule from "../../app/repositories";

jest.mock("../../app/repositories");
jest.mock("../../utils/formatter");

describe("newTransaction", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("realiza uma nova transação com origem e destino válidos", async () => {
    const sourceAccount = { id: "acc-1", balance: 2000 };
    const destinationAccount = { id: "acc-2", balance: 1000 };

    (accountRepository.findOneBy as jest.Mock)
      .mockImplementation(({ id }) => {
        if (id === sourceAccount.id) return Promise.resolve({ ...sourceAccount });
        if (id === destinationAccount.id) return Promise.resolve({ ...destinationAccount });
        return null;
      });

    (accountRepository.save as jest.Mock).mockImplementation(acc => Promise.resolve(acc));
    (transactionRepository.create as jest.Mock).mockImplementation(tx => tx);
    (transactionRepository.save as jest.Mock).mockImplementation(tx => Promise.resolve(tx));

    const result = await newTransaction({
      amount: 500,
      description: "Teste transferência",
      sourceAccount,
      destinationAccount,
    });

    expect(accountRepository.findOneBy).toHaveBeenCalledTimes(2);
    expect(accountRepository.save).toHaveBeenCalledTimes(3);
    expect(transactionRepository.create).toHaveBeenCalled();
    expect(transactionRepository.save).toHaveBeenCalled();
    expect(result.amount).toBe(500);
    expect(result.originAccount.id).toBe(sourceAccount.id);
    expect(result.destinationAccount.id).toBe(destinationAccount.id);
  });

  it("lança erro se saldo insuficiente", async () => {
    const sourceAccount = { id: "acc-1", balance: 100 };
    const destinationAccount = { id: "acc-2", balance: 1000 };

    (accountRepository.findOneBy as jest.Mock)
      .mockImplementation(({ id }) => {
        if (id === sourceAccount.id) return Promise.resolve({ ...sourceAccount });
        if (id === destinationAccount.id) return Promise.resolve({ ...destinationAccount });
        return null;
      });

    await expect(
      newTransaction({
        amount: 200,
        description: "Teste saldo insuficiente",
        sourceAccount,
        destinationAccount,
      })
    ).rejects.toThrow("Saldo insuficiente");
  });

  it("lança erro se conta de origem não encontrada", async () => {
    const sourceAccount = { id: "acc-1", balance: 1000 };
    const destinationAccount = { id: "acc-2", balance: 1000 };

    (accountRepository.findOneBy as jest.Mock)
      .mockImplementation(({ id }) => {
        if (id === destinationAccount.id) return Promise.resolve({ ...destinationAccount });
        return null;
      });

    await expect(
      newTransaction({
        amount: 100,
        description: "Teste conta origem inexistente",
        sourceAccount,
        destinationAccount,
      })
    ).rejects.toThrow("Conta de origem não encontrada");
  });

  it("lança erro se valor da transação for zero", async () => {
    const sourceAccount = { id: "acc-1", balance: 1000 };
    const destinationAccount = { id: "acc-2", balance: 1000 };

    (accountRepository.findOneBy as jest.Mock)
      .mockImplementation(({ id }) => {
        if (id === sourceAccount.id) return Promise.resolve({ ...sourceAccount });
        if (id === destinationAccount.id) return Promise.resolve({ ...destinationAccount });
        return null;
      });

    await expect(
      newTransaction({
        amount: 0,
        description: "Teste valor zero",
        sourceAccount,
        destinationAccount,
      })
    ).rejects.toThrow("É necessário transferir algum valor");
  });
});
describe("getTransactions", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Defina mocks manuais básicos para evitar undefined
    (userRepository.findOne as jest.Mock) = jest.fn();
    (transactionRepository.createQueryBuilder as jest.Mock) = jest.fn();
    (accountRepository.findOne as jest.Mock) = jest.fn();

    (formatMoney as jest.Mock) = jest.fn();
    (formatDate as jest.Mock) = jest.fn();
  });

  it("retorna transações para usuário válido", async () => {
    const mockUser = {
      id: "user-1",
      accounts: [{ id: "acc-1" }, { id: "acc-2" }],
    };

    const mockTransactions = [
      {
        id: "tx-1",
        amount: 1000,
        originAccount: { id: "acc-1" },
        destinationAccount: { id: "acc-2" },
        originAccountId: "acc-1",
        destinationAccountId: "acc-2",
        created_at: new Date(),
        originBalance: 5000,
        destinationBalance: 6000,
      },
    ];

    (userRepository.findOne as jest.Mock).mockResolvedValue(mockUser);
    (transactionRepository.createQueryBuilder as jest.Mock).mockReturnValue({
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      withDeleted: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue(mockTransactions),
    });

    (accountRepository.findOne as jest.Mock).mockResolvedValue(null);

    (formatMoney as jest.Mock).mockImplementation((v) => `R$${v}`);
    (formatDate as jest.Mock).mockImplementation((d) => d.toString());


    const result = await getTransactions({ user_id: "user-1" });

    expect(userRepository.findOne).toHaveBeenCalledWith({
      where: { id: "user-1" },
      relations: ["accounts"],
    });
    expect(result).toHaveLength(1);
    expect(result[0].amount).toBe("R$1000");
    expect(result[0].created_at).toBe(mockTransactions[0].created_at.toString());
  });

  it("filtra transações por account_id", async () => {
    const mockUser = {
      id: "user-1",
      accounts: [{ id: "acc-1" }],
    };

    (userRepository.findOne as jest.Mock).mockResolvedValue(mockUser);
    (transactionRepository.createQueryBuilder as jest.Mock).mockReturnValue({
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      withDeleted: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue([]),
    });

    (accountRepository.findOne as jest.Mock).mockResolvedValue(null);
    (formatMoney as jest.Mock).mockImplementation((v) => `R$${v}`);
    (formatDate as jest.Mock).mockImplementation((d) => d.toString());

    const result = await getTransactions({ user_id: "user-1", account_id: "acc-1" });

    expect(result).toEqual([]);
  });

  it("lança erro se usuário não encontrado", async () => {
    (userRepository.findOne as jest.Mock).mockResolvedValue(null);

    await expect(getTransactions({ user_id: "user-x" })).rejects.toThrow(
      "Usuário não encontrado"
    );
  });
});
