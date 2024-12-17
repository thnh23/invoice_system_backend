import { Body, Controller, HttpCode, HttpStatus, Inject, Param, Request, Patch, Post, UseGuards, Delete, Get, Query } from '@nestjs/common';
import { IUserRepository, IUserService } from './user.port';
import { USER_REPOSITORY, USER_SERVICE } from './user.di-token';
import { UserLoginDTO, UserRegistrationDTO, UserUpdateDTO } from './user.dto';
import { RemoteAuthGuard } from 'src/share/guard/auth';
import { ReqWithRequester} from 'src/share/interface';
import { User } from './user.entity';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';
import { IntrospectDto } from 'src/share/token.dto';


@Controller('users')
export class UserHttpController {
    constructor(
        @Inject(USER_SERVICE)
        private readonly userService: IUserService
    ) { }

    @Post('register')
    @ApiCreatedResponse({
        description: 'The record has been successfully created.',
        type: User,
      })
    @HttpCode(HttpStatus.OK)
    async register(@Body() dto: UserRegistrationDTO) {
        //Get data: newId to response to client
        try{
        const data = await this.userService.register(dto);
        return { data };
        }catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    }

    @Post('authenticate')
    @HttpCode(HttpStatus.OK)
    async authenticate(@Body() dto: UserLoginDTO) {
        //Get data: return a token to authenticate
        const data = await this.userService.login(dto);
        return { data };
    }

    @Patch('user/:id')
    @ApiBearerAuth('JWT')
    @UseGuards(RemoteAuthGuard)
    @HttpCode(HttpStatus.OK)
    async updateUser(@Request() req: ReqWithRequester, @Param('id') id: string, @Body() dto: UserUpdateDTO) {
        const requester = req.requester;
        await this.userService.update(requester, id, dto);
        //return true
        return { data: true };
    }

    @Delete('user/:id')
    @ApiBearerAuth('JWT')
    @UseGuards(RemoteAuthGuard)
    @HttpCode(HttpStatus.OK)
    async deleteUser(@Request() req: ReqWithRequester, @Param('id') id: string) {
        const requester = req.requester;
        await this.userService.delete(requester, id);
        return { data: true };
    }
}

//Client can invoke methods, function on another service
@Controller('rpc')
export class UserRpcHttpController {
    constructor(
        @Inject(USER_SERVICE) private readonly userService: IUserService,
        @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository
    ) { }

    //Return user id
    @Post('introspect')
    @ApiOperation({ summary: 'Introspect a token' })
    @HttpCode(HttpStatus.OK)
    async introspect(@Body() dto: IntrospectDto ) {
        const result = await this.userService.introspectToken(dto.token);
        return { data: result };
    }

    @Get('user/:id')
    @HttpCode(HttpStatus.OK)
    async getUser(@Param('id') id: string) {
        const user = await this.userRepository.get(id);

        if (!user) {
            throw new Error("Not found");
        }

        return { data: this._toResponseModel(user) };
    }

    private _toResponseModel(data: User): Omit<User, 'password'> {
        const { password, ...rest } = data;
        return rest;
      }
}



