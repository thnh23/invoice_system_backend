import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../user/user.entity";
import { Customer } from "../customer/customer.entity";
import { ApiProperty } from "@nestjs/swagger";

export enum Status {
  PENDING = 'pending',
  PAID = 'paid',
}

@Entity()
export class Invoice{
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({ type: 'date' })
  issueDate: string;

  @ApiProperty()
  @Column()
  totalAmount: number;

  @ApiProperty()
  @Column({
    type: "enum",
    enum: Status,
    default: Status.PENDING
  })
  status: Status; 

  @ApiProperty({type: () => Customer})
  @ManyToOne(() => Customer, (customer) => customer.invoices)
  customer: Customer;

  @ApiProperty({type : () => User})
  @ManyToOne(() => User, (user) => user.invoices, { eager: true })
  user: User
}
