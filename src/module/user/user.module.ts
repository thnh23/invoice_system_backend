import { Module, Provider } from '@nestjs/common';
import { UsersService } from './user.service';
import { User } from './user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TOKEN_PROVIDER, USER_REPOSITORY, USER_SERVICE } from './user.di-token';
import { UserRepository } from './user.repo';
import { JwtTokenService } from 'src/share/components/jwt';
import { UserHttpController, UserRpcHttpController } from './user.controller';
import { ConfigService } from '@nestjs/config';
import { ShareModule } from 'src/share/module';

const repositories: Provider[] = [
  { provide: USER_REPOSITORY, useClass: UserRepository },
];

const services: Provider[] = [
  { provide: USER_SERVICE, useClass: UsersService },
];

const tokenProvider: Provider = {
  provide: TOKEN_PROVIDER, 
  useFactory: (configService: ConfigService) => {
    const secret = configService.get<string>('JWT_SECRET');  
    const expiresIn = '7d'; 

    if (!secret) {
      throw new Error('JWT_SECRET is not defined.');
    }

    return new JwtTokenService(secret, expiresIn);
  },
  inject: [ConfigService],
};

@Module({
  imports: [TypeOrmModule.forFeature([User]), ShareModule],
  providers: [...repositories, ...services, tokenProvider],
  controllers: [UserHttpController, UserRpcHttpController],
})

export class UsersModule { }
