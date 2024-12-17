import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";
import { Status } from "./invoice.entity";


export class InvoiceUpdateDTO {

    @ApiProperty()
    @IsOptional()
    @IsDateString()
    issueDate?: string;


    @ApiProperty()
    @IsOptional()
    @IsNumber()
    @IsPositive()
    totalAmount?: number;

    @ApiProperty()
    @IsOptional()
    @IsString()
    status?: Status;
}

export class InvoiceCreateDTO {
    @ApiProperty()
    @IsNotEmpty()
    customerId: string;

    @ApiProperty()
    @IsDateString()
    @IsNotEmpty()
    issueDate: string;


    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    totalAmount: number;

    @ApiProperty()
    @IsOptional()
    @IsString()
    status: Status = Status.PENDING;

    @ApiProperty()
    @IsNotEmpty()
    userId: string;
}
