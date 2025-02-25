import { Controller, HttpCode, HttpStatus, Inject, Post, UseGuards, Request, Body, Patch, Param, Delete, Get, Query } from "@nestjs/common";
import { RemoteAuthGuard } from "src/share/guard/auth";
import { ReqWithRequester } from "src/share/interface";
import { CustomerCreateDTO, CustomerUpdateDTO } from "./customer.dto";
import { CUSTOMER_REPOSITORY, CUSTOMER_SERVICE } from "./customer.di-token";
import { ICustomerRepository, ICustomerService } from "./customer.port";
import { ApiBearerAuth, ApiCreatedResponse, ApiHeader } from "@nestjs/swagger";
import { Customer } from "./customer.entity";
import { RolesGuard } from "src/share/guard/roles";



@Controller('customers')
@ApiBearerAuth('JWT')
export class CustomerHttpController{
    constructor(
        @Inject(CUSTOMER_SERVICE)
        private readonly customerService: ICustomerService,
        @Inject(CUSTOMER_REPOSITORY)
        private customerRepository: ICustomerRepository
    ){}


    @Post('create')
    @UseGuards(RemoteAuthGuard, RolesGuard)
    @ApiCreatedResponse({
        description: 'The record has been successfully created.',
        type: Customer,
      })
    @HttpCode(HttpStatus.OK)
    async createInvoice(@Request() req: ReqWithRequester, @Body()dto: CustomerCreateDTO){
        const requester = req.requester;
        const data = await this.customerService.createCustomer(requester, dto);
        return {data};
    }

    @Patch('customer/:id')
    @UseGuards(RemoteAuthGuard, RolesGuard)
    @HttpCode(HttpStatus.OK)
    async updateInvoice(@Request() req: ReqWithRequester, @Param('id') id: string,  @Body()dto: CustomerUpdateDTO){
        const requester = req.requester;
       await this.customerService.updateCustomer(requester,id,dto);
        return {data: true};
    }

    @Delete('customer/:id')
    @UseGuards(RemoteAuthGuard, RolesGuard)
    @HttpCode(HttpStatus.OK)
    async deleteInvoice(@Request() req: ReqWithRequester, @Param('id') id: string){
        const requester = req.requester;
        await this.customerService.deleteCustomer(requester, id);
        return { data: true };
    }

    @Get()
    @UseGuards(RemoteAuthGuard, RolesGuard)
    @HttpCode(HttpStatus.OK)
    async listCustomer(@Query('UserId') userId: string){
     const data = await this.customerRepository.listCustomers(userId);
     const transfromedData = data.map(e => this._toResponseModel(e));
     return {data: transfromedData};
    }

    @Get("customer/count")
    @UseGuards(RemoteAuthGuard, RolesGuard)
    @HttpCode(HttpStatus.OK)
    async countCustomers(@Query('UserId') userId: string){
     const data = await this.customerRepository.countCustomers(userId);
     return {data}
    }

    private _toResponseModel(data: Customer): Omit<Customer, 'user'> {
        const {user, ...rest} = data
        return rest;
      }
}