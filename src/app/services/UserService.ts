
import { IUser } from "../interfaces/interfaces";
import { User } from "../entities/User";
import { userRepository } from "../repositories";

const getUser = async (id: string): Promise<User | null> => {
  return userRepository.findOne({
    where: { id },
    select: ['id', 'name', 'email']
  });
};

const getUserWithPassword = async (email: string): Promise<User | null> => {
  return userRepository.findOne({
    where: { email },
    select: ['id', 'name', 'email', 'password'] // Inclui a senha para comparar
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

export { getUser, newUser, editUser, deleteUser, getUserWithPassword };
