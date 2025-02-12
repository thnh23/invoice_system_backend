import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { ITokenIntrospect } from 'src/share/interface';
import { TOKEN_INTROSPECTOR } from '../di-token';
import { ErrTokenInvalid } from '../app-error';


function extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    // Lay gia tri header neu ton tai
    // Tach thanh 1 mang voi khoang trang lam dau phan cach
    return type === 'Bearer' ? token : undefined;
}

@Injectable()
export class RemoteAuthGuard implements CanActivate {
    constructor(
        @Inject(TOKEN_INTROSPECTOR)
        private readonly introspector: ITokenIntrospect,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = extractTokenFromHeader(request);

        if (!token) {
            throw new UnauthorizedException();
        }


        try {
            const { payload, error, isOk } = await this.introspector.introspect(token);

            if (!isOk) {
                throw ErrTokenInvalid.withLog('Token parse failed').withLog(error!.message);
            }

            request['requester'] = payload;

        } catch {
            throw new UnauthorizedException();
        }
        return true;
    }




}