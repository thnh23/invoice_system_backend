import { Inject, Injectable } from "@nestjs/common";
import { IInvoiceRepository } from "./invoice.port";
import { InjectRepository } from "@nestjs/typeorm";
import { Invoice } from "./invoice.entity";
import { Brackets, In, Repository } from "typeorm";
import { InvoiceUpdateDTO } from "./invoice.dto";



const ITEMS_PER_PAGE = 6;
@Injectable()
export class InvoiceRepository implements IInvoiceRepository {
    constructor(
        @InjectRepository(Invoice)
        private invoiceRepository: Repository<Invoice>,
    ) { }


    async insert(invoice: Invoice): Promise<void> {
        await this.invoiceRepository.create(invoice);
        await this.invoiceRepository.save(invoice);
    }


    async update(id: string, dto: InvoiceUpdateDTO): Promise<void> {
        await this.invoiceRepository.update(id, dto);
    }

    async delete(id: string): Promise<void> {
        await this.invoiceRepository.delete(id);
    }

    async get(id: string): Promise<Invoice | null> {
        return await this.invoiceRepository.findOne({
            where: { id: id }
        });
    }

    // async listByIds(ids: string[]): Promise<Invoice[]> {
    //    return await this.invoiceRepository.find({
    //     where: {
    //       id: In(ids),
    //     }
    //   });
    // }   

    async listInvoices(userId: string): Promise<Invoice[] | null> {
        return await this.invoiceRepository.find({
            where: {
                user: { id: userId }
            }
        })
    }

    async listLatestInvoices(userId: string): Promise<Invoice[] | null> {
        const data = await this.invoiceRepository
            .createQueryBuilder("invoices")
            .leftJoinAndSelect("invoices.customer", "customers")
            .select(["invoices.totalAmount", "customers.fullName", "customers.image_url", "customers.email", "invoices.id"])
            .where('invoices.userId = :userId', { userId: userId })
            .orderBy("invoices.issueDate", "DESC")
            .limit(5)
            .getMany();
        return data;
    }

    async countInvoices(userId: string): Promise<number> {
        const data = await this.invoiceRepository
            .createQueryBuilder("invoices")
            .select("COUNT(*)", "count")
            .where("invoices.userId = :id", { id: userId })
            .groupBy("invoices.userId")
            .getRawOne();
        return data ? data.count : 0;
    }

    async sumInvoicesPerStatus(userId: string): Promise<number> {
        const data = await this.invoiceRepository
            .createQueryBuilder("invoices")
            .select([
                "SUM(CASE WHEN invoices.status = 'paid' THEN invoices.totalAmount ELSE 0 END) AS paid",
                "SUM(CASE WHEN invoices.status = 'pending' THEN invoices.totalAmount ELSE 0 END) AS pending"
            ])
            .where('invoices.userId = :userId', { userId: userId })
            .getRawOne();

        return data;
    }

    async listFilteredInvoices(userId: string, query: string, currentPage: number): Promise<Invoice[] | null> {
        const offset = (currentPage - 1) * ITEMS_PER_PAGE;

        const queryBuilder = this.invoiceRepository.createQueryBuilder('invoices')
            .innerJoinAndSelect('invoices.customer', 'customers')
            .where('invoices.userId = :userId', { userId: userId });

        if (query && query.trim() !== '') {
            queryBuilder.andWhere(
                new Brackets((qb) => {
                    qb.where('customers.name ILIKE :query', { query: `%${query}%` })
                        .orWhere('customers.email ILIKE :query', { query: `%${query}%` })
                        .orWhere('invoices.totalAmount::text ILIKE :query', { query: `%${query}%` })
                        .orWhere('invoices.issueDate::text ILIKE :query', { query: `%${query}%` })
                        .orWhere('invoices.status ILIKE :query', { query: `%${query}%` });
                })
            );
        }

        queryBuilder
            .orderBy('invoices.issueDate', 'DESC')
            .limit(ITEMS_PER_PAGE)
            .offset(offset);

        const data = await queryBuilder.getMany();
        return data;
    }

    async listInvoicePage(userId: string, query: string): Promise<number> {
        const queryBuilder = this.invoiceRepository.createQueryBuilder('invoices')
            .innerJoinAndSelect('invoices.customer', 'customers')
            .select("COUNT(*)", "count")
            .where('invoices.userId = :userId', { userId: userId });

        if (query && query.trim() !== '') {
            queryBuilder.andWhere(
                new Brackets((qb) => {
                    qb.where('customers.name ILIKE :query', { query: `%${query}%` })
                        .orWhere('customers.email ILIKE :query', { query: `%${query}%` })
                        .orWhere('invoices.totalAmount::text ILIKE :query', { query: `%${query}%` })
                        .orWhere('invoices.issueDate::text ILIKE :query', { query: `%${query}%` })
                        .orWhere('invoices.status ILIKE :query', { query: `%${query}%` });
                })
            );
        }

        queryBuilder.groupBy("invoices.userId");

        const data = await queryBuilder.getRawOne();
        
        const totalPages = Math.ceil(Number(data.count) / ITEMS_PER_PAGE);

        return totalPages;

    }
}