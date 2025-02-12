import { MiddlewareConsumer, Module, NestModule, Provider, RequestMethod } from '@nestjs/common';
import { UsersModule } from './module/user/user.module';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { User } from './module/user/user.entity';
import { CustomerModule } from './module/customer/customer.module';
import { InvoiceModule } from './module/invoice/invoice.module';
import { Invoice } from './module/invoice/invoice.entity';
import { Customer } from './module/customer/customer.entity';
import { ShareModule } from './share/module';
import { AppService } from './app.service';
import { configuration } from './share/config';
import { RateLimitMiddleware } from './share/rate-limiter/rate-limit.middleware';
import { RateLimiterModule } from './share/rate-limiter/rate-limiter.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User, Customer, Invoice]),
    UsersModule,
    CustomerModule,
    InvoiceModule,
    ShareModule,
    RateLimiterModule,
  ],
  controllers: [AppController],
  providers: [AppService,
  ],
})

export class AppModule {
   configure(consumer: MiddlewareConsumer) {
    consumer.apply(RateLimitMiddleware)
    .forRoutes(
      { path: 'customers', method: RequestMethod.ALL },
      {path: 'invoices', method: RequestMethod.ALL},
      {path: 'users', method: RequestMethod.ALL}
    );

  }
}
