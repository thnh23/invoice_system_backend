import { TokenIntrospectRPCClient } from "./rpc/token-introspect.rpc";
import { TOKEN_INTROSPECTOR } from "./di-token";
import { Module, Provider } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";


const tokenIntrospector: Provider = {
    provide: TOKEN_INTROSPECTOR,
    useFactory: (configService : ConfigService) => {
        const introspectURL = configService.get<string>("VERIFY_TOKEN_URL");

        if(!introspectURL){
            throw new Error('VERIFY_TOKEN_URL is not defined.');
        }
        return new TokenIntrospectRPCClient(introspectURL);
    },
    inject: [ConfigService],
};

@Module({
    providers: [tokenIntrospector],
    exports: [tokenIntrospector]
})

export class ShareModule {}