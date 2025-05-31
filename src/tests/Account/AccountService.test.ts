import {
  accountRepository,
  accountTypesRepository,
  userRepository,
} from "../../app/repositories";

import { 
  newAccount, editAccount, getAccount, deleteAccount, listAccounts 
} from "../../app/services/AccountService";

import { newTransaction, getTransactions } from "../../app/services/TransactionService";

jest.mock("../../app/repositories", () => ({
  accountRepository: {
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    softDelete: jest.fn(),
  },
  accountTypesRepository: {
    findOneBy: jest.fn(),
    createQueryBuilder: jest.fn(),
  },
  userRepository: {
    findOneBy: jest.fn(),
  },
}));

jest.mock("../../app/services/TransactionService", () => ({
  newTransaction: jest.fn(),
  getTransactions: jest.fn(),
}));

describe("AccountService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("newAccount", () => {
    it("cria nova conta com sucesso e chama newTransaction se balance > 0", async () => {
      const mockUser = { id: "user-1" };
      const mockType = { id: "type-1" };
      const mockAccount = { id: "acc-1" };

      (userRepository.findOneBy as jest.Mock).mockResolvedValue(mockUser);
      (accountTypesRepository.findOneBy as jest.Mock).mockResolvedValue(mockType);
      (accountRepository.create as jest.Mock).mockReturnValue(mockAccount);
      (accountRepository.save as jest.Mock).mockResolvedValue(undefined);
      (newTransaction as jest.Mock).mockResolvedValue(undefined);

      const result = await newAccount({
        name: "Conta Teste",
        type_id: "type-1",
        balance: 100,
        user_id: "user-1",
        description: "descrição",
        color: "blue",
      });

      expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: "user-1" });
      expect(accountTypesRepository.findOneBy).toHaveBeenCalledWith({ id: "type-1" });
      expect(accountRepository.create).toHaveBeenCalledWith({
        accountType: mockType,
        user: mockUser,
        description: "descrição",
        balance: 0,
        color: "blue",
        name: "Conta Teste",
      });
      expect(accountRepository.save).toHaveBeenCalledWith(mockAccount);
      expect(newTransaction).toHaveBeenCalledWith({
        amount: 100,
        description: "Saldo inicial",
        destinationAccount: { id: mockAccount.id },
      });
      expect(result).toBe(mockAccount);
    });

    it("lança erro se usuário não encontrado", async () => {
      (userRepository.findOneBy as jest.Mock).mockResolvedValue(null);

      await expect(
        newAccount({
          name: "Conta Teste",
          type_id: "type-1",
          balance: 0,
          user_id: "user-x",
          description: "",
          color: "",
        })
      ).rejects.toThrow("Usuário inválido");
    });

    it("lança erro se tipo não encontrado", async () => {
      (userRepository.findOneBy as jest.Mock).mockResolvedValue({ id: "user-1" });
      (accountTypesRepository.findOneBy as jest.Mock).mockResolvedValue(null);

      await expect(
        newAccount({
          name: "Conta Teste",
          type_id: "type-x",
          balance: 0,
          user_id: "user-1",
          description: "",
          color: "",
        })
      ).rejects.toThrow("Tipo de conta não encontrado");
    });
  });

  describe("deleteAccount", () => {
    it("deleta conta com saldo 0 com sucesso", async () => {
      (accountRepository.findOneBy as jest.Mock).mockResolvedValue({ id: "acc-1", balance: 0 });
      (accountRepository.softDelete as jest.Mock).mockResolvedValue(undefined);

      await expect(deleteAccount("acc-1")).resolves.toBeUndefined();

      expect(accountRepository.findOneBy).toHaveBeenCalledWith({ id: "acc-1" });
      expect(accountRepository.softDelete).toHaveBeenCalledWith("acc-1");
    });

    it("lança erro se conta não encontrada", async () => {
      (accountRepository.findOneBy as jest.Mock).mockResolvedValue(null);

      await expect(deleteAccount("acc-x")).rejects.toThrow("Conta não encontrada ");
    });

    it("lança erro se saldo diferente de zero", async () => {
      (accountRepository.findOneBy as jest.Mock).mockResolvedValue({ id: "acc-1", balance: 100 });

      await expect(deleteAccount("acc-1")).rejects.toThrow("Esvazie a conta ");
    });
  });

  describe("editAccount", () => {
    it("edita conta com sucesso", async () => {
      const mockAccount = {
        id: "acc-1",
        user: { id: "user-1" },
        name: "Old Name",
        description: "Old desc",
        color: "red",
        accountType: {},
      };
      const mockType = { user: [{ id: "user-1" }] };
      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockType),
      };

      (accountRepository.findOne as jest.Mock).mockResolvedValue(mockAccount);
      (accountTypesRepository.createQueryBuilder as jest.Mock).mockReturnValue(mockQueryBuilder);
      (accountRepository.save as jest.Mock).mockResolvedValue(undefined);

      const result = await editAccount({
        id: "acc-1",
        name: "New Name",
        description: "New desc",
        color: "blue",
        type_id: "type-1",
      });

      expect(accountRepository.findOne).toHaveBeenCalledWith({
        where: { id: "acc-1" },
        relations: ["user", "accountType"],
      });
      expect(accountTypesRepository.createQueryBuilder).toHaveBeenCalledWith("type");
      expect(mockQueryBuilder.where).toHaveBeenCalledWith("type.id = :typeId", { typeId: "type-1" });
      expect(accountRepository.save).toHaveBeenCalled();

      expect(result.name).toBe("New Name");
      expect(result.description).toBe("New desc");
      expect(result.color).toBe("blue");
      expect(result.accountType).toBe(mockType);
    });

    it("lança erro se conta não encontrada", async () => {
      (accountRepository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(
        editAccount({ id: "acc-x", name: "", description: "", color: "", type_id: "type-1" })
      ).rejects.toThrow("Conta não encontrada");
    });

    it("lança erro se tipo não encontrado", async () => {
      (accountRepository.findOne as jest.Mock).mockResolvedValue({
        id: "acc-1",
        user: { id: "user-1" },
        accountType: {},
      });

      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      };

      (accountTypesRepository.createQueryBuilder as jest.Mock).mockReturnValue(mockQueryBuilder);

      await expect(
        editAccount({ id: "acc-1", name: "", description: "", color: "", type_id: "type-x" })
      ).rejects.toThrow("Tipo não encontrado");
    });

    it("lança erro se tipo não pertence ao usuário", async () => {
      const mockAccount = {
        id: "acc-1",
        user: { id: "user-1" },
        accountType: {},
      };

      const mockType = { user: [{ id: "user-2" }] }; 
      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockType),
      };

      (accountRepository.findOne as jest.Mock).mockResolvedValue(mockAccount);
      (accountTypesRepository.createQueryBuilder as jest.Mock).mockReturnValue(mockQueryBuilder);

      await expect(
        editAccount({ id: "acc-1", name: "", description: "", color: "", type_id: "type-1" })
      ).rejects.toThrow("Tipo de conta não pertence a este usuário");
    });
  });
  describe("getAccount", () => {
    it("retorna conta com sucesso", async () => {
      const mockAccount = {
        id: "acc-1",
        name: "Conta A",
        balance: 1234,
        user: { id: "user-1" },
        accountType: { id: "type-1", name: "Tipo A" },
        updated_at: new Date(),
        created_at: new Date(),
        description: "descrição da conta",
        color: "blue",
      };
  
      (accountRepository.findOne as jest.Mock).mockResolvedValue(mockAccount);
      (getTransactions as jest.Mock).mockResolvedValue([]);
  
      const result = await getAccount({ id: "acc-1", user_id: "user-1" });
  
      expect(accountRepository.findOne).toHaveBeenCalledWith({
        where: { id: "acc-1" },
        relations: ["user", "accountType"],
      });
      expect(getTransactions).toHaveBeenCalledWith({ user_id: "user-1", account_id: "acc-1" });
  
      expect(result.id).toBe("acc-1");
      expect(result.name).toBe("Conta A");
      expect(result.balance).toMatch(/^\D*\d/); 
      expect(result.type).toEqual(mockAccount.accountType);
      expect(result.description).toBe("descrição da conta");
      expect(result.color).toBe("blue");
      expect(result.transactions).toEqual([]);
    });
  
    it("lança erro se conta não encontrada", async () => {
      (accountRepository.findOne as jest.Mock).mockResolvedValue(null);
  
      await expect(getAccount({ id: "acc-x", user_id: "user-1" })).rejects.toThrow(
        "Conta não encontrada"
      );
    });
  
    it("lança erro se conta não pertence ao usuário", async () => {
      const mockAccount = {
        id: "acc-1",
        user: { id: "user-2" }, 
        accountType: {},
      };
  
      (accountRepository.findOne as jest.Mock).mockResolvedValue(mockAccount);
  
      await expect(getAccount({ id: "acc-1", user_id: "user-1" })).rejects.toThrow(
        "Conta não pertence ao usuário"
      );
    });
  });
});