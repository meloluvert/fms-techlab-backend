import {
    accountTypesRepository,
    userRepository,
  } from "../../app/repositories";
  import { editType, newType, getTypes } from "../../app/services/AccountTypesService";
  import { AccountType } from "../../app/entities/AccountTypes";
  import { AppDataSource } from "../../database/data-source";
  
  jest.mock("../../app/repositories", () => ({
    accountTypesRepository: {
      findOne: jest.fn(),
      save: jest.fn(),
      create: jest.fn(),
    },
    userRepository: {
      findOneBy: jest.fn(),
    },
  }));
  
  jest.mock("../../database/data-source", () => ({
    AppDataSource: {
      getRepository: jest.fn(),
    },
  }));
  
  describe("editType", () => {
    it("edita tipo com sucesso", async () => {
      const mockType = { id: "type-1", name: "Old" } as AccountType;
  
      (accountTypesRepository.findOne as jest.Mock).mockResolvedValue(mockType);
      (accountTypesRepository.save as jest.Mock).mockResolvedValue(undefined);
  
      const result = await editType({ id: "type-1", name: "New" });
  
      expect(result.name).toBe("New");
      expect(accountTypesRepository.save).toHaveBeenCalledWith({
        ...mockType,
        name: "New",
      });
    });
  });
  
  describe("newType", () => {
    it("cria um tipo de conta com sucesso", async () => {
      const mockUser = { id: "user-123" };
      const mockAccountType = {
        id: "type-abc",
        name: "Investimento",
        user: [mockUser],
      } as AccountType;
  
      (userRepository.findOneBy as jest.Mock).mockResolvedValue(mockUser);
      (accountTypesRepository.create as jest.Mock).mockReturnValue(mockAccountType);
      (accountTypesRepository.save as jest.Mock).mockResolvedValue(undefined);
  
      const result = await newType({ name: "Investimento", user_id: "user-123" });
  
      expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: "user-123" });
      expect(accountTypesRepository.create).toHaveBeenCalledWith({
        name: "Investimento",
        user: [mockUser],
      });
      expect(accountTypesRepository.save).toHaveBeenCalledWith(mockAccountType);
      expect(result).toEqual(mockAccountType);
    });
  
    it("lança erro se o usuário não for encontrado", async () => {
      (userRepository.findOneBy as jest.Mock).mockResolvedValue(null);
  
      await expect(
        newType({ name: "Salário", user_id: "user-404" })
      ).rejects.toThrow("Usuário não encontrado");
    });
  });
  