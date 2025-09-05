// import {
//   ExceptionFilter,
//   Catch,
//   ArgumentsHost,
//   HttpStatus,
// } from '@nestjs/common';
// import { Response } from 'express';
// import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

// @Catch(PrismaClientKnownRequestError)
// export class PrismaExceptionFilter implements ExceptionFilter {
//   catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost) {
//     const ctx = host.switchToHttp();
//     const response = ctx.getResponse<Response>();

//     let status: number;
//     let message: string;

//     switch (exception.code) {
//       case 'P2002':
//         status = HttpStatus.CONFLICT;
//         message = 'Unique constraint violation';
//         break;
//       case 'P2025':
//         status = HttpStatus.NOT_FOUND;
//         message = 'Record not found';
//         break;
//       case 'P2003':
//         status = HttpStatus.BAD_REQUEST;
//         message = 'Foreign key constraint violation';
//         break;
//       default:
//         status = HttpStatus.INTERNAL_SERVER_ERROR;
//         message = 'Database error';
//     }

//     response.status(status).json({
//       statusCode: status,
//       message,
//       error: exception.code,
//       timestamp: new Date().toISOString(),
//     });
//   }
// }
