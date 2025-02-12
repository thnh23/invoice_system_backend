


export interface TokenPayload{
    sub: string;
    role: UserRole;
}


export interface Requester extends TokenPayload { }

//Request with requester
export interface ReqWithRequester { requester: Requester; }
export interface ReqWithRequesterOpt { requester?: Requester; }

export interface ITokenProvider {
    generateToken(payload: TokenPayload): Promise<string>;
    verifyToken(token: string): Promise<TokenPayload | null>;
    isTokenExpried(token: string): Promise<boolean>;
}

export type TokenIntrospectResult = {
    payload: TokenPayload | null;
    error?: Error;
    isOk: boolean;
}

export interface ITokenIntrospect{
    introspect(token: string): Promise<TokenIntrospectResult>;
}

export enum UserRole {
    ADMIN = 'admin',
    USER = 'user'
}
