import { AppDataSource } from "../../database/data-source";
import { AccountType } from "../entities/AccountTypes";
import { IAccountType } from "../interfaces/interfaces";

const accountTypesRepository = AppDataSource.getRepository(AccountType);

export const newType = async ({ name }: IAccountType): Promise<AccountType> => {
    const accountType = accountTypesRepository.create({ name});
    await accountTypesRepository.save(accountType);
    return accountType;
};

export const getType = async (id: number): Promise<AccountType | null> => {
  return accountTypesRepository.findOne({
    where: { id },
  });
};