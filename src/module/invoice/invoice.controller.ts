import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Inject, Param, Patch, Post, Query, Request, UseGuards} from "@nestjs/common";
import { IInvoiceRepository, IInvoiceService } from "./invoice.port";
import { INVOICE_REPOSITORY, INVOICE_SERVICE } from "./invoice.di-token";
import { CustomerService } from "../customer/customer.service";
import { ReqWithRequester } from "src/share/interface";
import { InvoiceCreateDTO, InvoiceUpdateDTO } from "./invoice.dto";
import { RemoteAuthGuard } from "src/share/guard/auth";
import { ApiBearerAuth, ApiCreatedResponse, ApiQuery } from "@nestjs/swagger";
import { Invoice } from "./invoice.entity";

@Controller('invoices')
@ApiBearerAuth('JWT')
export class InvoiceHttpController {
    constructor(
        @Inject(INVOICE_SERVICE)
        private readonly invoiceService: IInvoiceService,
        @Inject(INVOICE_REPOSITORY)
        private invoiceRepository: IInvoiceRepository
    ) {}


    @Post('create')
    @UseGuards(RemoteAuthGuard)
    @ApiCreatedResponse({
        description: 'The record has been successfully created.',
        type: Invoice,
      })
    @HttpCode(HttpStatus.OK)
    async createInvoice(@Request() req: ReqWithRequester, @Body()dto: InvoiceCreateDTO){
        const requester = req.requester;
        const data = await this.invoiceService.createInvoice(requester, dto);
        return {data};
    }


    @Patch('invoice/:id')
    @UseGuards(RemoteAuthGuard)
    @HttpCode(HttpStatus.OK)
    async updateInvoice(@Request() req: ReqWithRequester, @Param('id') id: string,  @Body()dto: InvoiceUpdateDTO){
        const requester = req.requester;
       await this.invoiceService.updateInvoice(requester,id,dto);
        return {data: true};
    }

    @Delete('invoice/:id')
    @UseGuards(RemoteAuthGuard)
    @HttpCode(HttpStatus.OK)
    async deleteInvoice(@Request() req: ReqWithRequester, @Param('id') id: string){
        const requester = req.requester;
        await this.invoiceService.deleteInvoice(requester, id);
        return { data: true };
    }

    // @Get()
    // @UseGuards(RemoteAuthGuard)
    // @HttpCode(HttpStatus.OK)
    // async listInvoice(@Query('UserId') userId: string ){
    //     const data = await this.invoiceRepository.listInvoices(userId);
    //     return {data}
    // }

    @Get('invoice/count')
    @UseGuards(RemoteAuthGuard)
    @HttpCode(HttpStatus.OK)
    async countInvoices(@Query('UserId') userId: string ){
        const data = await this.invoiceRepository.countInvoices(userId);
        return {data}
    }

   
    @Get()
    @UseGuards(RemoteAuthGuard)
    @HttpCode(HttpStatus.OK)
    async listInvoice(@Query('UserId') userId: string ){
        const data = await this.invoiceRepository.listLatestInvoices(userId);
        return {data}
    }

    @Get('invoice/sum')
    @UseGuards(RemoteAuthGuard)
    @HttpCode(HttpStatus.OK)
    async sumInvocesPerStatus(@Query('UserId') userId: string){
        const data = await this.invoiceRepository.sumInvoicesPerStatus(userId);
        return {data}
    }

    
    @Get('invoice/list')
    @ApiQuery({
        name: "Query",
        required: false,
        description: "query param",
        type: String
    })
    @UseGuards(RemoteAuthGuard)
    @HttpCode(HttpStatus.OK)
    async listFilteredInvoices(@Query('UserId') userId: string, @Query('Query') query: string, @Query('CurrentPage') currentPage: number ){
        const data = await this.invoiceRepository.listFilteredInvoices(userId, query, currentPage);
        return {data}
    }

    @Get('invoice/invoice_page')
    @ApiQuery({
        name: "Query",
        required: false,
        description: "query param",
        type: String
    })
    @UseGuards(RemoteAuthGuard)
    @HttpCode(HttpStatus.OK)
    async listInvoicePage(@Query('UserId') userId: string, @Query('Query') query: string){
        const data = await this.invoiceRepository.listInvoicePage(userId, query);
        return {data}
    }
}


