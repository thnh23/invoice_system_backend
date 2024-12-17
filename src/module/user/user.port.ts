import { Requester, TokenPayload } from "src/share/interface";
import { UserCondDTO, UserLoginDTO, UserRegistrationDTO, UserUpdateDTO} from "./user.dto";
import { User } from "./user.entity";

export interface IUserService {
    register(dto: UserRegistrationDTO): Promise<String>
    login(dto: UserLoginDTO): Promise<string>
    update(requester: Requester, userId: string, dto: UserUpdateDTO): Promise<void>
    delete(requester: Requester, userId: string): Promise<void>
    introspectToken(token: string): Promise<TokenPayload>;
}

export interface IUserRepository {
   // Query
  get(id: string): Promise<User | null>
  findByCond(cond: UserCondDTO): Promise<User | null>
  // Command
  insert(user: User): Promise<void>
  update(id: string, dto: UserUpdateDTO): Promise<void>
  delete(id: string): Promise<void>
}
