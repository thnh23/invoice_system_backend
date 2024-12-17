export class AppError extends Error {
    private statusCode: number = 500;
    private rootCause?: Error;

    private details: Record<string, any> = {}
    private logMessages?: string;

    private constructor(err: Error){
        super(err.message);
    }

    static from(err: Error, statusCode: number = 500) {
        const appError = new AppError(err);
        appError.statusCode = statusCode;
        return appError;
    }

    getRootCause(): Error | null {
        if (this.rootCause) {
          return this.rootCause instanceof AppError ? this.rootCause.getRootCause() : this.rootCause;
        }
    
        return null;
    }

    wrap(rootCause: Error): AppError {
        const appError = AppError.from(this, this.statusCode);
        appError.rootCause = rootCause;
        return appError;
    }

    withDetail(key: string, value: any): AppError {
        this.details[key] = value;
        return this;
    }

    withLog(logMessages: string): AppError {
        this.logMessages = logMessages;
        return this;
    }

    withMessage(message: string): AppError {
        this.message = message;
        return this;
      }

}

export const ErrInternalServer = AppError.from(new Error('Something went wrong, please try again later.'), 500);
export const ErrInvalidRequest = AppError.from(new Error('Invalid request'), 400);
export const ErrUnauthorized = AppError.from(new Error('Unauthorized'), 401);
export const ErrForbidden = AppError.from(new Error('Forbidden'), 403);
export const ErrNotFound = AppError.from(new Error('Not found'), 404);
export const ErrMethodNotAllowed = AppError.from(new Error('Method not allowed'), 405);
export const ErrTokenInvalid = AppError.from(new Error('Token is invalid'), 401);