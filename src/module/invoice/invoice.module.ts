import { Module, Provider } from "@nestjs/common";
import { INVOICE_REPOSITORY, INVOICE_SERVICE } from "./invoice.di-token";
import { InvoiceRepository } from "./invoice.repo";
import { InvoiceService } from "./invoice.service";
import { Invoice } from "./invoice.entity";
import { CustomerModule } from "../customer/customer.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { InvoiceHttpController } from "./invoice.controller";
import { UsersModule } from "../user/user.module";
import { CUSTOMER_REPOSITORY } from "../customer/customer.di-token";
import { CustomerRepository } from "../customer/customer.repo";
import { USER_REPOSITORY } from "../user/user.di-token";
import { UserRepository } from "../user/user.repo";
import { Customer } from "../customer/customer.entity";
import { User } from "../user/user.entity";
import { ShareModule } from "src/share/module";




const repositories: Provider[] = [
    { provide: INVOICE_REPOSITORY, useClass: InvoiceRepository },
    {provide : CUSTOMER_REPOSITORY, useClass: CustomerRepository},
    {provide: USER_REPOSITORY, useClass: UserRepository}
  ];
  
  const services: Provider[] = [
    { provide: INVOICE_SERVICE, useClass: InvoiceService },
  ];


  @Module({
    imports: [TypeOrmModule.forFeature([Invoice]), TypeOrmModule.forFeature([Customer]), TypeOrmModule.forFeature([User]), ShareModule],
    providers: [...repositories, ...services],
    controllers: [InvoiceHttpController],
  })
  
  export class InvoiceModule { }
  