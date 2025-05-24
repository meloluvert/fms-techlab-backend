import { User } from "../entities";
import {IUser} from "../interfaces/interfaces";
import { AppDataSource } from "../../database/data-source";

export const userRepository = AppDataSource.getRepository(User);

const getUser = (id: string): Promise<User | null> => {
  return userRepository.findOne({
    where: { id },
  });
};

const newUser = async ({ name, email, password }: IUser): Promise<User> => {
  const user = userRepository.create({ name, email, password });
  await userRepository.save(user);
  return user;
};

export { getUser, newUser };
