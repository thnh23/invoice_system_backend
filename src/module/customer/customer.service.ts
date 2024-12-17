import { Inject, Injectable } from "@nestjs/common";
import { Customer } from "./customer.entity";
import { CustomerCreateDTO, CustomerUpdateDTO } from "./customer.dto";
import { USER_REPOSITORY } from "../user/user.di-token";
import { IUserRepository } from "../user/user.port";
import { v7 } from "uuid";
import { Requester } from "src/share/interface";
import { CUSTOMER_REPOSITORY } from "./customer.di-token";
import { ICustomerRepository, ICustomerService } from "./customer.port";
import { AppError, ErrForbidden, ErrNotFound } from "src/share/app-error";

@Injectable()
export class CustomerService implements ICustomerService{
    constructor(
        @Inject(CUSTOMER_REPOSITORY)
        private customerRepository: ICustomerRepository,
        @Inject(USER_REPOSITORY)
        private userRepository: IUserRepository
    ){}

    async createCustomer(requester: Requester, dto: CustomerCreateDTO): Promise<string>
    {

        const user = await this.userRepository.get(dto.userId);
        if (!user) {
           throw AppError.from(ErrNotFound, 400).withLog('User not found');
        }

        if(requester.sub != user.id){
           throw AppError.from(ErrForbidden, 400);
        }
        const newId = v7();

        const customer: Customer = {
            ...dto,
             id: newId, 
             user: user, 
             invoices: [],
        };
        
        await this.customerRepository.insert(customer);
        return newId;
    }

    async updateCustomer(requester: Requester, customerId: string, dto: CustomerUpdateDTO) : Promise<boolean> {
        const existed = await this.customerRepository.get(customerId);

        if(!existed){
            throw AppError.from(ErrNotFound, 400).withLog('Customer not found');
        }

        if(requester.sub != existed.user.id){
            throw AppError.from(ErrForbidden, 400);
        }

        await this.customerRepository.update(customerId, dto);
        return true;
    }

    async deleteCustomer(requester: Requester, customerId: string) : Promise<boolean> {
        const existed = await this.customerRepository.get(customerId);

        if(!existed){
            throw AppError.from(ErrNotFound, 400).withLog('Customer not found');
        }

        

        if(requester.sub != existed.user.id){
            throw AppError.from(ErrForbidden, 400);
        }

        await this.customerRepository.delete(customerId);

        return true;
    }

}