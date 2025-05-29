import {  getUser, getUserWithPassword, newUser, editUser, deleteUser} from "../../app/services/UserService";
import { userRepository } from "../../app/repositories";
jest.mock("../../app/repositories", () => {
  return {
    userRepository: {
      findOne: jest.fn(),
      findOneBy: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      softDelete: jest.fn(),
    },
  };
});

describe("userService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getUser", () => {
    it("deve retornar usuário existente", async () => {
      const mockUser = { id: "1", name: "João", email: "joao@email.com" };
      (userRepository.findOne as jest.Mock).mockResolvedValue(mockUser);

      const result = await getUser("1");
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: "1" },
        select: ["id", "name", "email"],
      });
      expect(result).toEqual(mockUser);
    });

    it("deve retornar null se usuário não encontrado", async () => {
      (userRepository.findOne as jest.Mock).mockResolvedValue(null);

      const result = await getUser("999");
      expect(result).toBeNull();
    });
  });

  describe("getUserWithPassword", () => {
    it("deve retornar usuário com senha", async () => {
      const mockUser = { id: "1", name: "João", email: "joao@email.com", password: "hash" };
      (userRepository.findOne as jest.Mock).mockResolvedValue(mockUser);

      const result = await getUserWithPassword("joao@email.com");
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email: "joao@email.com" },
        select: ["id", "name", "email", "password"],
      });
      expect(result).toEqual(mockUser);
    });
  });

  describe("newUser", () => {
    it("deve criar e salvar novo usuário", async () => {
      const input = { name: "Maria", email: "maria@email.com", password: "123" };
      const mockUser = { id: "2", ...input };

      (userRepository.create as jest.Mock).mockReturnValue(mockUser);
      (userRepository.save as jest.Mock).mockResolvedValue(mockUser);

      const result = await newUser(input);
      expect(userRepository.create).toHaveBeenCalledWith(input);
      expect(userRepository.save).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockUser);
    });
  });

  describe("editUser", () => {
    it("deve editar usuário existente", async () => {
      const existingUser = { id: "1", name: "João", email: "joao@email.com", password: "oldpass" };
      const updates = { id: "1", name: "João Silva", email: "joaosilva@email.com", password: "newpass" };
      const savedUser = { ...existingUser, ...updates };

      (userRepository.findOneBy as jest.Mock).mockResolvedValue(existingUser);
      (userRepository.save as jest.Mock).mockResolvedValue(savedUser);

      const result = await editUser(updates);
      expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: "1" });
      expect(userRepository.save).toHaveBeenCalledWith(savedUser);
      expect(result).toEqual(savedUser);
    });

    it("deve lançar erro se usuário não encontrado", async () => {
      (userRepository.findOneBy as jest.Mock).mockResolvedValue(null);

      await expect(editUser({ id: "999", name:"Maria", email:"maria@email.com" })).rejects.toThrow("Usuário não encontrado");
    });
  });

  describe("deleteUser", () => {
    it("deve deletar usuário existente", async () => {
      const mockUser = { id: "1" };
      (userRepository.findOneBy as jest.Mock).mockResolvedValue(mockUser);
      (userRepository.softDelete as jest.Mock).mockResolvedValue(undefined);

      await deleteUser("1");
      expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: "1" });
      expect(userRepository.softDelete).toHaveBeenCalledWith("1");
    });

    it("deve lançar erro se usuário não encontrado", async () => {
      (userRepository.findOneBy as jest.Mock).mockResolvedValue(null);

      await expect(deleteUser("999")).rejects.toThrow("Usuário não encontrado");
    });
  });
});
