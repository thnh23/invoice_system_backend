import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../user/user.entity";
import { Invoice } from "../invoice/invoice.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity()
export class Customer{
    @ApiProperty()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty()
    @Column()
    fullName: string;

    @ApiProperty()
    @Column()
    address: string;

    @ApiProperty()
    @Column()
    phoneNumber: string;

    @ApiProperty()
    @Column()
    email: string;

    @ApiProperty()
    @Column()
    image_url: string;

    @ApiProperty({type:() => User})
    @ManyToOne(() => User, (user) => user.customers , { eager: true })
    @JoinColumn({ name: 'userId' })
    user: User;

    @ApiProperty({type:() => [Invoice]})
    @OneToMany(() => Invoice, (invoices) => invoices.customer, { eager: true })
    invoices: Invoice[];
}