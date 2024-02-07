/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import handleZodError from '../errors/handleZodError';
import handleDuplicateError from '../errors/handleDuplicateError';
import handleValidationError from '../errors/handleValidationError';
import handleCastError from '../errors/handleCastError';
import AppError from '../errors/AppError';
import httpStatus from 'http-status';

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  // here default values
  let statusCode = 500;
  let message = 'Internal server error!';
  let errorMessage = '';
  let errorDetails: object | null = {};
  // handle zod error
  if (err instanceof ZodError) {
    const handledError = handleZodError(err);
    statusCode = handledError?.statusCode;
    message = handledError?.message;
    errorMessage = handledError?.errorMessage;
    errorDetails = handledError.errorDetails;
  }
  // handle duplicate error
  else if (err?.code === 11000) {
    const handledError = handleDuplicateError(err);
    statusCode = handledError?.statusCode;
    message = handledError?.message;
    errorMessage = handledError?.errorMessage;
    errorDetails = handledError.errorDetails;
  }
  // handle validation error
  else if (err?.name === 'ValidationError') {
    const handledError = handleValidationError(err);
    statusCode = handledError?.statusCode;
    message = handledError?.message;
    errorMessage = handledError?.errorMessage;
    errorDetails = handledError.errorDetails;
  }
  // handle cast error
  else if (err?.name === 'CastError') {
    const handledError = handleCastError(err);
    statusCode = handledError?.statusCode;
    message = handledError?.message;
    errorMessage = handledError?.errorMessage;
    errorDetails = handledError.errorDetails;
  }

  // handle custom app error
  else if (err instanceof AppError) {
    statusCode = err?.statusCode;
    message = err.message;
  }
  //  handle default throw new Error
  else if (err instanceof Error) {
    message = err.message;
  }
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    statusCode = httpStatus.UNAUTHORIZED;
    message = 'Unauthorized Access';
    errorMessage =
      'You do not have the necessary permissions to access this resource.';
    errorDetails = null;
    err.stack = null;
  }
  //   send error response
  return res.status(statusCode).json({
    success: false,
    message,
    errorMessage,
    errorDetails,
    stack: err?.stack || null,
  });
};

export default globalErrorHandler;
