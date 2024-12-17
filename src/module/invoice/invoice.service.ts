import { Inject, Injectable } from "@nestjs/common";
import { IInvoiceRepository, IInvoiceService } from "./invoice.port";
import { INVOICE_REPOSITORY } from "./invoice.di-token";
import { Requester } from "src/share/interface";
import { InvoiceCreateDTO, InvoiceUpdateDTO } from "./invoice.dto";
import { Invoice } from "./invoice.entity";
import { v7 } from "uuid";
import { USER_REPOSITORY } from "../user/user.di-token";
import { IUserRepository } from "../user/user.port";
import { CUSTOMER_REPOSITORY } from "../customer/customer.di-token";
import { ICustomerRepository } from "../customer/customer.port";
import { AppError, ErrForbidden, ErrNotFound } from "src/share/app-error";


@Injectable()
export class InvoiceService implements IInvoiceService {
    constructor(
        @Inject(INVOICE_REPOSITORY)
        private invoiceRepository: IInvoiceRepository,
        @Inject(CUSTOMER_REPOSITORY)
        private customerRepository: ICustomerRepository,
        @Inject(USER_REPOSITORY)
        private userRepository: IUserRepository
    ) { }

    async createInvoice(requester: Requester, dto: InvoiceCreateDTO): Promise<string> {
    
        
        const customer = await this.customerRepository.get(dto.customerId);

        if(!customer) {
            throw AppError.from(ErrNotFound, 400).withLog('Customer not found');
        }

        const user = await this.userRepository.get(dto.userId);
    
        if(requester.sub != user.id){
           throw AppError.from(ErrForbidden, 400);
        }
        const newId = v7();

        const invoice: Invoice = {
            ...dto,
            id: newId,
            customer: customer,
            user: user
        };

        await this.invoiceRepository.insert(invoice);
        return newId;
    }

    async updateInvoice(requester: Requester, invoiceId: string, dto: InvoiceUpdateDTO): Promise<boolean> {
        const existed = await this.invoiceRepository.get(invoiceId);

        if(!existed){
            throw AppError.from(ErrNotFound, 400).withLog('Invoice not found');
        }

        const reqUser = existed.user.id;

        if(requester.sub != reqUser){
           throw AppError.from(ErrForbidden, 400);
        }

        await this.invoiceRepository.update(invoiceId,dto);
        return true;
    }

    async deleteInvoice(requester: Requester, invoiceId: string): Promise<boolean> {
        const existed = await this.invoiceRepository.get(invoiceId);

        if(!existed){
            throw AppError.from(ErrNotFound, 400).withLog('Invoice not found');
        }

        const reqUserId = existed.user.id;

        if(requester.sub != reqUserId){
            throw AppError.from(ErrForbidden, 400);
        }
        await this.invoiceRepository.delete(reqUserId);
        return true;
    }
}
