import { Inject, Injectable } from "@nestjs/common";
import { ICustomerRepository } from "./customer.port";
import { CustomerUpdateDTO } from "./customer.dto";
import { Customer } from "./customer.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";



@Injectable()
export class CustomerRepository implements ICustomerRepository{
    constructor(
        @InjectRepository(Customer)
        private customerRepository: Repository<Customer>,
    ){ }

    async insert(customer: Customer): Promise<void> {
        await this.customerRepository.create(customer);
        await this.customerRepository.save(customer);
    }

    async update(id: string, dto: CustomerUpdateDTO): Promise<void> {
        await this.customerRepository.update(id, dto);
    }

    async delete(id: string): Promise<void> {
      await this.customerRepository.delete(id);
    }

    async get(id: string): Promise<Customer | null> {
         return await this.customerRepository.findOne({
        where: {id: id}
       });
    }

    async listCustomers(userId: string): Promise<Customer[] | null> {
        const customers = await this.customerRepository.find({
            where: { user : { id: userId} }
        });
        return customers; 
    }

    async countCustomers(userId: string): Promise<number> {
        const data = await this.customerRepository
        .createQueryBuilder("c")
        .select("COUNT(*)","count")
        .where("c.userId = :id",{id : userId})
        .groupBy("c.userId")
        .getRawOne();
        return data ? data.count : 0;
    }

    
}
    