import { Injectable, OnModuleDestroy } from "@nestjs/common";
import * as redis from "redis"




@Injectable()
export class RedisService implements OnModuleDestroy {
    private client : redis.RedisClientType;


    constructor(){
        this.client = redis.createClient({
            url: process.env.REDIS_URL,
        });

        this.client.connect().catch((err) => console.log('Redis connection error:', err));
    }

    getClient() : redis.RedisClientType {
        return this.client;
    }


    async searchKeys(pattern: string): Promise<string[]> {
        let cursor = 0;
        let keys: string[] = [];

        do{
            const result = await this.client.scan(cursor, { 
                MATCH: pattern,
                COUNT: 100,
            });

            cursor = result.cursor;
            keys = keys.concat(result.keys);
        } while (cursor !== 0);

        return keys;
    }


    async onModuleDestroy() {
        await this.client.quit();
      }
}




