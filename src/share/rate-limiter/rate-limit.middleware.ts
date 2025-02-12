import { Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { RateLimiterService } from "./rate-limiter.service";
import { NextFunction, Request, Response } from "express";
import { ConfigService } from "@nestjs/config";
import { RateLimitExceededError } from "./rate-limit-exceeded.error";
import { LoggerTest } from "./logger";


@Injectable()
export class RateLimitMiddleware implements NestMiddleware{
    constructor(
        private readonly rateLimiter : RateLimiterService,
        private configService : ConfigService,
        private logger : LoggerTest,
    ){}
    
    async use(req: Request, res: Response, next: NextFunction) {
        try {
            const token = req.ip;
            const limit = 10;
            const weight = 1;
    
            const result = await this.rateLimiter.check(token, { limit, weight });
    
            if (result.isOverLimit) {
                throw new RateLimitExceededError(limit, result.secondsUntilLiftingLimit);
            }
    
            next(); 
        } catch (err) {
            next(err);  
        }
    }
    
    
}