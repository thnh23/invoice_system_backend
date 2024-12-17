import { Injectable } from '@nestjs/common';
import { FindOptionsWhere, Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserCondDTO, UserUpdateDTO } from './user.dto';
import { IUserRepository } from './user.port';

@Injectable()
export class UserRepository implements IUserRepository{
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }


    async get(id: string): Promise<User> {
        return await this.userRepository.findOne({ where: { id } });
    }

    async findByCond(cond: UserCondDTO): Promise<User | null>{
        return await this.userRepository.findOneBy(cond as  FindOptionsWhere<User>);
    }

   async insert(user : User): Promise<void>{
    await this.userRepository.create(user);
    await this.userRepository.save(user);
   }

   async update(id: string, dto: UserUpdateDTO): Promise<void> {
    await this.userRepository.update(id, dto);
   }

   async delete(id: string ){
    await this.userRepository.delete(id);
   }


   

}

