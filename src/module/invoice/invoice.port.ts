import { Requester } from "src/share/interface";
import { InvoiceCreateDTO, InvoiceUpdateDTO } from "./invoice.dto";
import { Invoice } from "./invoice.entity";


export interface IInvoiceService {
    createInvoice(requester: Requester,dto: InvoiceCreateDTO) : Promise<string>
    updateInvoice(requester: Requester, invoiceNumber: string, dto: InvoiceUpdateDTO): Promise<boolean>
    deleteInvoice(requester: Requester, invoiceNumber: string): Promise<boolean>
}

export interface IInvoiceRepository{
    insert(invoice: Invoice): Promise<void>
    update(id: string, dto: InvoiceUpdateDTO): Promise<void>
    delete(id: string ): Promise<void>

    get(id: string): Promise<Invoice | null>
    listInvoices(userId: string): Promise<Invoice[] |null>
    listLatestInvoices(userId : string) :Promise<Invoice[] |null>
    countInvoices(userId: string): Promise<number>
    sumInvoicesPerStatus(userId: string): Promise<number>
    listFilteredInvoices(userId: string, query: string, currentPage: number) : Promise<Invoice[] | null>
    listInvoicePage(userId: string, query: string) : Promise<number>
}