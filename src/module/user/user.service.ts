import { Inject, Injectable } from '@nestjs/common';
import { ErrExpriedToken, ErrInvalidToken, ErrInvalidUsernameAndPassword, User } from './user.entity';
import * as bcrypt from 'bcrypt'
import { v7 } from "uuid";
import { IUserRepository, IUserService } from './user.port';
import { ITokenProvider, Requester, TokenPayload, UserRole } from 'src/share/interface';
import { UserRegistrationDTO, UserLoginDTO, UserUpdateDTO } from './user.dto';
import { TOKEN_PROVIDER, USER_REPOSITORY } from './user.di-token';
import { AppError, ErrForbidden, ErrNotFound } from '../../share/app-error';
import { RedisService } from 'src/share/components/redis';
import { RedisClientType } from 'redis';




@Injectable()
export class UsersService implements IUserService{
     private redisClient: RedisClientType;
    
    constructor(
        private readonly redisService: RedisService,
        @Inject(USER_REPOSITORY)
        private userRepository: IUserRepository,
        @Inject(TOKEN_PROVIDER)
        private readonly tokenProvider: ITokenProvider,
    ) { 
        this.redisClient = redisService.getClient()
    }



    async register(dto: UserRegistrationDTO): Promise<String> {
        const user = await this.userRepository.findByCond({username: dto.username});

        if(user) throw new Error("username existed");

        const hashedPassword = await bcrypt.hash(dto.password, 10);

        const newId = v7();
        const newUser: User = {
            ...dto,
            id: newId,
            password: hashedPassword,
            role: UserRole.USER,
            customers: [],
            invoices: [],
        }
    await this.userRepository.insert(newUser);
    return newId;
    }

    
    async login(dto: UserLoginDTO): Promise<string> {
       
        const user = await this.userRepository.findByCond({ username: dto.username });
        if (!user) {
            throw AppError.from(ErrInvalidUsernameAndPassword, 400).withLog('Username not found');
        }
    
       
        const isMatch = await bcrypt.compare(dto.password, user.password);
        if (!isMatch) {
            throw AppError.from(ErrInvalidUsernameAndPassword, 400).withLog('Password is incorrect');
        }
    
        
         let storedToken: string = await this.redisClient.get(user.id);
    
        // If no token is found or the token is expired, generate a new token
         if (!storedToken || await this.tokenProvider.isTokenExpried(storedToken)) {
                  if (storedToken) {
             //         // If token is expired, delete it from cache
                      await this.redisClient.del(user.id);
                 }
    
            // Generate a new token
            const token = await this.tokenProvider.generateToken({ sub: user.id, role: user.role });
    
            // Store the new token in cache with a TTL of 10 minutes (36000 seconds)
             await this.redisClient.set(user.id, token,{
                EX: 10 * 60 * 60
             });
    
            // console.log(user.id);
            // console.log(await cache.get(user.id));  // Log the stored token for debugging
            return token;
        }
    
        // If token is found and valid, return it
         return storedToken;
    }

   
    async update(requester: Requester, userId: string, dto: UserUpdateDTO): Promise<void> {
         // Authorization check (isAdmin && isSelf)
        if(requester.role !== UserRole.ADMIN && requester.sub !== userId){
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
         // Authorization check (isAdmin && isSelf)
         if(requester.role !== UserRole.ADMIN && requester.sub !== userId){
            throw AppError.from(ErrForbidden, 400);
        }

        await this.userRepository.delete(userId);
    }

    //Authenticate
    async introspectToken(token: string): Promise<TokenPayload> {

        //verify token: is invalid or exprided
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
            sub:  user.id,
            role: user.role
        }
    }
}

