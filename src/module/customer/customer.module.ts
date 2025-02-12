import { MiddlewareConsumer, Module, Provider, RequestMethod } from "@nestjs/common";
import { CustomerService } from "./customer.service";
import { CUSTOMER_REPOSITORY, CUSTOMER_SERVICE } from "./customer.di-token";
import { CustomerRepository } from "./customer.repo";
import { Customer } from "./customer.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CustomerHttpController } from "./customer.controller";
import { USER_REPOSITORY } from "../user/user.di-token";
import { UserRepository } from "../user/user.repo";
import { User } from "../user/user.entity";
import { ShareModule } from "src/share/module";

const repositories: Provider[] = [
    { provide: CUSTOMER_REPOSITORY, useClass: CustomerRepository },
    {provide: USER_REPOSITORY, useClass: UserRepository},
  ];
  
  const services: Provider[] = [
    { provide: CUSTOMER_SERVICE, useClass: CustomerService },
  ];


  @Module({
    imports: [TypeOrmModule.forFeature([Customer]), TypeOrmModule.forFeature([User]), ShareModule],
    providers: [...repositories, ...services],
    controllers: [CustomerHttpController],
  })

export class CustomerModule{ 

}