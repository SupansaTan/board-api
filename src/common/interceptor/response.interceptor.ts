import { CallHandler, ExecutionContext, Injectable, NestInterceptor, HttpStatus, HttpException } from '@nestjs/common';
import { catchError, map, Observable, throwError } from 'rxjs';
import { IResponse } from '../interface/response.dto';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, IResponse<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Observable<IResponse<T>> {
    return next.handle().pipe(
      map((response: T) => this.responseHandler(response)),
      catchError((err: HttpException) =>
        throwError(() => this.errorHandler(err, context)),
      ),
    );
  }

  responseHandler(res: any): IResponse<T> {
    return {
      statusCode: HttpStatus.OK,
      message: "success",
      data: res,
    };
  }

  errorHandler(exception: HttpException, context: ExecutionContext) {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(status).json({
      statusCode: status,
      message: exception.message,
      data: exception ? exception.getResponse() : null,
    });
  }
}