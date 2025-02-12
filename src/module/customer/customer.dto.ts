import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsNumberString, IsOptional, IsPhoneNumber, IsString } from "class-validator";

export class CustomerCreateDTO{
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    fullName: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    address: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsPhoneNumber('VN',{message: 'Phone number is invalid'})
    phoneNumber: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    image_url: string;

    @ApiProperty()
    @IsNotEmpty()
    userId: string;
}

export class CustomerUpdateDTO{
    @ApiProperty()
    @IsOptional()
    @IsString()
    fullName?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    address?: string;

    @ApiProperty()
    @IsOptional()
    @IsPhoneNumber('VN',{message: 'Phone number is invalid'})
    phoneNumber?: string;

    @ApiProperty()
    @IsOptional()
    @IsEmail()
    email?: string;
    
    @ApiProperty()
    @IsOptional()
    @IsString()
    image_url?: string;

}