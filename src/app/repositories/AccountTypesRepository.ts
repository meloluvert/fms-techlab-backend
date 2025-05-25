import { AppDataSource } from "../../database/data-source";
import { AccountType } from "../entities/AccountTypes";
import { IAccountType } from "../interfaces/interfaces";
import { userRepository } from "./UserRepository";
const accountTypesRepository = AppDataSource.getRepository(AccountType);
export const newType = async ({ name, user_id }: IAccountType): Promise<AccountType> => {
  // Buscar o usuário
  const user = await userRepository.findOneBy({ id: user_id });
  if (!user) {
    throw new Error("Usuário não encontrado");
  }

  // Criar o tipo de conta e associar o usuário
  const accountType = accountTypesRepository.create({
    name,
    user: [user], // ← como é ManyToMany, precisa ser array
  });

  // Salvar com relação ManyToMany
  await accountTypesRepository.save(accountType);

  return accountType;
};

export const getType = async (id: number): Promise<AccountType | null> => {
  return accountTypesRepository.findOne({
    where: { id },
  });
};

export const editType = async ({id, name}:IAccountType): Promise<AccountType> => {
  const accountType = await accountTypesRepository.findOne({
    where: { id },
  });
  
    if (!accountType) {
      throw new Error("Tipo não encontrado");
    }

    accountType.name = name ?? accountType.name;
    await accountTypesRepository.save(accountType);
    return accountType
  }
export const deleteType = async (id: number): Promise<void> => {
  const accountType = await accountTypesRepository.findOneBy({ id });

  if (!accountType) {
    throw new Error("Usuário não encontrado");
  }
  await accountTypesRepository.softDelete(id);
};

export const getTypes = async (userId: string): Promise<AccountType[]> => {
  const accountTypes = await AppDataSource
    .getRepository(AccountType)
    .createQueryBuilder("type")
    .leftJoin("type.user", "user") // relação ManyToMany
    .where("user.id IS NULL OR user.id = :userId", { userId })
    .getMany();

  return accountTypes;
};