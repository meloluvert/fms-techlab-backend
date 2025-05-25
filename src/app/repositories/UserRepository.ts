
import { IUser } from "../interfaces/interfaces";
import { AppDataSource } from "../../database/data-source";
import { User } from "../entities/User";
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
const editUser = async ({
  id,
  email,
  name,
  password,
}: IUser): Promise<User> => {
  const user = await userRepository.findOneBy({ id });

  if (!user) {
    throw new Error("Usuário não encontrado");
  }

  user.email = email ?? user.email;
  user.name = name ?? user.name;
  user.password = password ?? user.password;

  await userRepository.save(user);

  return user;
};

const deleteUser = async (id: string): Promise<void> => {
  const user = await userRepository.findOneBy({ id });

  if (!user) {
    throw new Error("Usuário não encontrado");
  }
  await userRepository.softDelete(id);
};

export { getUser, newUser, editUser, deleteUser };
