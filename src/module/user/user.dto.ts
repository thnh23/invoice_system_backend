import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsMobilePhone, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { ErrEmailAtLeast5Chars, ErrPasswordAtLeast8Chars, ErrPasswordInvalid, ErrUsernameAtLeast3Chars, ErrUsernameAtMost25Chars, ErrUsernameInvalid } from './user.entity';


export class UserRegistrationDTO {
  @ApiProperty()
  @MinLength(3, ErrUsernameAtLeast3Chars)
  @MaxLength(25, ErrUsernameAtMost25Chars)
  @IsString()
  @Matches(/^[a-zA-Z0-9_]+$/, ErrUsernameInvalid)
  username: string;

  @ApiProperty()
  @MinLength(8, ErrPasswordAtLeast8Chars)
  @IsString()
  @Matches(/((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&])[A-Za-z0-9@$!%*?&]+)+/g, ErrPasswordInvalid)
  password: string;

  @ApiProperty()
  @IsEmail()
  @MinLength(5, ErrEmailAtLeast5Chars)
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  full_name: string;

  @ApiProperty()
  @IsPhoneNumber('VN',{message: 'Phone number is invalid'})
  phone_number: string;

}

export class UserUpdateDTO {
  @ApiProperty()
  @IsOptional()
  @MinLength(8, ErrPasswordAtLeast8Chars)
  @IsString()
  @Matches(/((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&])[A-Za-z0-9@$!%*?&]+)+/g, ErrPasswordInvalid)
    password?: string;

    @ApiProperty()
    @IsOptional()
    @IsEmail()
    @MinLength(5, ErrEmailAtLeast5Chars)
    email?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    full_name?: string;

    @ApiProperty()
    @IsOptional()
    @IsPhoneNumber('VN',{message: 'Phone number is invalid'})
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

