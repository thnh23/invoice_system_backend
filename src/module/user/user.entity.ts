
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Invoice } from "../invoice/invoice.entity";
import { Customer } from "../customer/customer.entity";
import { ApiProperty } from "@nestjs/swagger";

export const ErrUsernameExisted = new Error('Username is already existed');
export const ErrInvalidUsernameAndPassword = new Error('Invalid username and password');
export const ErrInvalidToken = new Error('Invalid token');



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

    @ApiProperty({type :() => [Customer]})
    @OneToMany(() =>Customer, (customers) =>customers.user)
    customers: Customer[];
  
    @ApiProperty({ type:() => [Invoice]})
    @OneToMany(() => Invoice, (invoices) => invoices.user )
    invoices: Invoice[];
    
}
