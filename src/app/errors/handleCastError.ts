import mongoose from 'mongoose';

import httpStatus from 'http-status';
import { TGenericErrorResponse } from '../interface/error';

const handleCastError = (
  err: mongoose.Error.CastError,
): TGenericErrorResponse => {
  const statusCode = httpStatus.BAD_REQUEST;

  return {
    statusCode,
    message: 'Invalid ID',
    errorMessage: `${err.value} is not a valid ID!`,
    errorDetails: err,
  };
};

export default handleCastError;
