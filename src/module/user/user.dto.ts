import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';


export class UserRegistrationDTO {
  @ApiProperty()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    minLength: 8,
  })
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  full_name: string;

  @ApiProperty()
  @IsNotEmpty()
  phone_number: string;

}

export class UserUpdateDTO {
    @ApiProperty({
        minLength: 8,
    })
    @IsOptional()
    @IsString()
    @MinLength(8)
    password?: string;

    @ApiProperty()
    @IsOptional()
    @IsEmail()
    email?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    full_name?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    phone_number?: string;
}

export class UserLoginDTO{
    @ApiProperty()
    @IsString()
    username: string;

    @ApiProperty()
    @IsString()
    password: string
}

export class UserCondDTO{
    @ApiProperty()
    @IsOptional()
    @IsString()
    username?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    full_name?: string;


}

