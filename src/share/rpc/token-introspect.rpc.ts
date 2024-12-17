import { Injectable } from "@nestjs/common";
import axios from "axios";
import { ITokenIntrospect, TokenIntrospectResult } from "../interface";


@Injectable()
export class TokenIntrospectRPCClient implements ITokenIntrospect {
    constructor(private readonly url: string) { }

    async introspect(token: string) : Promise<TokenIntrospectResult> {
        try{
            const { data } = await
             axios.post(`${this.url}`, { token });

             
            const {sub} = data.data;

          
            return {
                payload: {sub},
                isOk: true,
            };
        } catch (error) {
            return {
                payload: null,
                error: error as Error,
                isOk: false,
            };
        }
    }
}