import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

import { DomainException } from '../../domain/exceptions/domain-exception';
import { NotFoundException } from '../../domain/exceptions/not-found-exception';
import { DuplicateException } from '../../domain/exceptions/duplicate-exception';
import { ValidationException } from '../../domain/exceptions/validation-exception';

@Catch(DomainException)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: DomainException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;

    if (exception instanceof NotFoundException) {
      status = HttpStatus.NOT_FOUND;
    } else if (exception instanceof DuplicateException) {
      status = HttpStatus.CONFLICT;
    } else if (exception instanceof ValidationException) {
      status = HttpStatus.BAD_REQUEST;
    }

    response.status(status).json({
      statusCode: status,
      message: exception.message,
      code: exception.code,
      details: exception.details,
      timestamp: new Date().toISOString(),
    });
  }
}
