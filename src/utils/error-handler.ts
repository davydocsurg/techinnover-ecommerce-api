import { Response } from 'express';
import { HttpException, HttpStatus } from '@nestjs/common';

export function handleError(res: Response, error: any): void {
  if (error instanceof HttpException) {
    res.status(error.getStatus()).json({
      statusCode: error.getStatus(),
      message: error.getResponse(),
    });
  } else {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
    });
  }
}
