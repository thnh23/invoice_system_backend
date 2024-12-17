import { Requester } from "src/share/interface";
import { CustomerCreateDTO, CustomerUpdateDTO } from "./customer.dto";
import { Customer } from "./customer.entity";



export interface ICustomerService {
    createCustomer(requester: Requester,dto: CustomerCreateDTO) : Promise<string>
    updateCustomer(requester: Requester, customerId: string, dto: CustomerUpdateDTO): Promise<boolean>
    deleteCustomer(requester: Requester, customerId: string): Promise<boolean>
}

export interface ICustomerRepository{
    insert(customer: Customer): Promise<void>
    update(id: string, dto: CustomerUpdateDTO): Promise<void>
    delete(id: string ): Promise<void>

    get(id: string): Promise<Customer | null>
    listCustomers(userId: string): Promise<Customer[] |null>
    countCustomers(userId: string): Promise<number>
}