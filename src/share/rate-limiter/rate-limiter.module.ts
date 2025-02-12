import { Module } from "@nestjs/common";
import { RateLimiterService } from "./rate-limiter.service";
import { LoggerTest } from "./logger";
import { RedisService } from "../components/redis";




@Module({
    providers: [RateLimiterService, LoggerTest,RedisService],
    exports: [RateLimiterService, LoggerTest,RedisService],

})

export class RateLimiterModule {}