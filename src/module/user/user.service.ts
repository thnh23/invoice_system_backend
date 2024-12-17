import { Inject, Injectable } from '@nestjs/common';
import { ErrInvalidToken, ErrInvalidUsernameAndPassword, User } from './user.entity';
import * as bcrypt from 'bcrypt'
import { v7 } from "uuid";
import { IUserRepository, IUserService } from './user.port';
import { ITokenProvider, Requester, TokenPayload } from 'src/share/interface';
import { UserRegistrationDTO, UserLoginDTO, UserUpdateDTO } from './user.dto';
import { TOKEN_PROVIDER, USER_REPOSITORY } from './user.di-token';
import { AppError, ErrForbidden, ErrNotFound } from 'src/share/app-error';


@Injectable()
export class UsersService implements IUserService{
    constructor(
        @Inject(USER_REPOSITORY)
        private userRepository: IUserRepository,
        @Inject(TOKEN_PROVIDER)
        private readonly tokenProvider: ITokenProvider,
    ) { }



    async register(dto: UserRegistrationDTO): Promise<String> {
        const user = await this.userRepository.findByCond({username: dto.username});

        if(user) throw new Error("username existed");

        const hashedPassword = await bcrypt.hash(dto.password, 10);

        const newId = v7();
        const newUser: User = {
            ...dto,
            id: newId,
            password: hashedPassword,
            customers: [],
            invoices: []
        }
    await this.userRepository.insert(newUser);
    return newId;
    }

    
    async login(dto: UserLoginDTO): Promise<string> {
        //Find user has username from database
        const user = await this.userRepository.findByCond({username: dto.username});
        if(!user){
            throw AppError.from(ErrInvalidUsernameAndPassword,400).withLog('Username not found');
        }

        //Chech password
        const isMatch = await bcrypt.compare( dto.password,user.password);
        if(!isMatch) {
            throw AppError.from(ErrInvalidUsernameAndPassword,400).withLog('Password is incorrect');
        }


        //Return token
        const token = await this.tokenProvider.generateToken({sub: user.id});
        return token;
    }

   
    async update(requester: Requester, userId: string, dto: UserUpdateDTO): Promise<void> {
         // Authorization check (isAdmin , isSelf)
        if(requester.sub !== userId){
            throw AppError.from(ErrForbidden, 400);
        }

        //Fetch user and check existence
       const user = await this.userRepository.get(userId);
       if(!user){
        throw AppError.from(ErrNotFound, 400);
       }

       //Update
       await this.userRepository.update(userId,dto);
    }

    async delete(requester: Requester, userId: string): Promise<void> {
         // Authorization check  isSelf
         if( requester.sub !== userId){
            throw AppError.from(ErrForbidden, 400);
        }

        await this.userRepository.delete(userId);
    }

    //Handle token
    async introspectToken(token: string): Promise<TokenPayload> {
        //verify token
        const payload = await this.tokenProvider.verifyToken(token);

        if(!payload){
            throw AppError.from(ErrInvalidToken, 400);
        }

        //get user by user id verify from token
        const user = await this.userRepository.get(payload.sub);

        if(!user){
            throw AppError.from(ErrNotFound, 400);
        }

        //return a instance of tokenpayload
        return {
            sub:  user.id
        }
    }
}

