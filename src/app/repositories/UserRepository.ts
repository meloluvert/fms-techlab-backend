import { User } from "../entities"
import IUser from "../interfaces/IUser"
import { AppDataSource } from "../../database/data-source"
const userRepository = AppDataSource.getRepository(User)
const getUser = (id: number): Promise<User> => {
    return userRepository.findOne({
        where: {
            id: id,
        },
    })
}

export {getUser}