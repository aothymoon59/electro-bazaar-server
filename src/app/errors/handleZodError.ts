import { ZodError, ZodIssue } from 'zod';
import { TGenericErrorResponse } from '../interface/error';
import httpStatus from 'http-status';

const handleZodError = (err: ZodError): TGenericErrorResponse => {
  let errorMessage = '';
  err.issues.forEach((issue: ZodIssue) => {
    errorMessage += `${issue?.path[issue.path.length - 1]} is required. `;
  });

  const statusCode = httpStatus.BAD_REQUEST;

  return {
    statusCode,
    message: 'Validation Error',
    errorMessage,
    errorDetails: err,
  };
};

export default handleZodError;
