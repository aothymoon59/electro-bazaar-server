import mongoose from 'mongoose';

import httpStatus from 'http-status';
import { TGenericErrorResponse } from '../interface/error';

const handleValidationError = (
  err: mongoose.Error.ValidationError,
): TGenericErrorResponse => {
  let errorMessage: string = '';
  Object.values(err.errors).forEach(
    (val: mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
      errorMessage += `${val?.path} is Required. `;
    },
  );

  const statusCode = httpStatus.BAD_REQUEST;

  return {
    statusCode,
    message: 'Validation Error',
    errorMessage,
    errorDetails: err,
  };
};

export default handleValidationError;
