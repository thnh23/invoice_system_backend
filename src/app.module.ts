import { Module } from '@nestjs/common';
import { UsersModule } from './module/user/user.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { User } from './module/user/user.entity';
import { CustomerModule } from './module/customer/customer.module';
import { InvoiceModule } from './module/invoice/invoice.module';
import { Invoice } from './module/invoice/invoice.entity';
import { Customer } from './module/customer/customer.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT,10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User,Customer,Invoice]),
    UsersModule,
    CustomerModule,
    InvoiceModule,
    ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
