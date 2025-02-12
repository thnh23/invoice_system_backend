
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Invoice } from "../invoice/invoice.entity";
import { Customer } from "../customer/customer.entity";
import { ApiProperty } from "@nestjs/swagger";
import { UserRole } from "src/share/interface";

export const ErrUsernameAtLeast3Chars = new Error('Username must be at least 3 characters');
export const ErrUsernameAtMost25Chars = new Error('Username must be at most 25 characters');
export const ErrPasswordAtLeast8Chars = new Error('Password must be at least 8 characters');
export const ErrPasswordInvalid = new Error('Password must be contain uppercase character, lowercase character, number and special character')
export const ErrUsernameInvalid = new Error('Username must contain only letters, numbers and underscore (_)');
export const ErrUsernameExisted = new Error('Username is already existed');
export const ErrInvalidUsernameAndPassword = new Error('Invalid username and password');
export const ErrInvalidToken = new Error('Invalid token');
export const ErrExpriedToken = new Error('Token is expried');
export const ErrInvalidEmail = new Error("Invalid email");
export const ErrEmailAtLeast5Chars = new Error('Email must be at least 5 characters');



@Entity()
export class User{
    @ApiProperty()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty()
    @Column({unique: true})
    username: string;
    
    @ApiProperty()
    @Column()
    password: string

    @ApiProperty()
    @Column({unique: true})
    email: string 

    @ApiProperty()
    @Column()
    full_name: string

    @ApiProperty()
    @Column()
    phone_number: string

    @ApiProperty()
    @Column({
        type: "enum",
        enum: UserRole,
        default: UserRole.USER
    })
    role: UserRole

    @ApiProperty({type :() => [Customer]})
    @OneToMany(() =>Customer, (customers) =>customers.user)
    customers: Customer[];
  
    @ApiProperty({ type:() => [Invoice]})
    @OneToMany(() => Invoice, (invoices) => invoices.user )
    invoices: Invoice[];
    
}
