import mongoose from 'mongoose';
import { env } from '../config/env.js';
import { AppError } from '../utils/AppError.js';

export const notFound = (request, _response, next) => {
  next(new AppError(404, 'not_found', `Route ${request.method} ${request.originalUrl} was not found.`));
};

export const errorHandler = (error, _request, response, _next) => {
  let normalized = error;
  if (error?.type === 'entity.too.large') {
    normalized = new AppError(413, 'body_too_large', 'The request body is too large.');
  } else if (error?.code === 'LIMIT_FILE_SIZE') {
    normalized = new AppError(413, 'image_too_large', 'Images must be 5 MB or smaller.');
  } else if (error instanceof mongoose.Error.ValidationError) {
    normalized = new AppError(422, 'validation_error', 'The submitted data is invalid.',
      Object.values(error.errors).map((item) => item.message));
  } else if (error instanceof mongoose.Error.CastError) {
    normalized = new AppError(400, 'invalid_id', 'The supplied resource identifier is invalid.');
  } else if (error?.code === 11000) {
    normalized = new AppError(409, 'duplicate_record', 'A record with that value already exists.');
  } else if (!(error instanceof AppError)) {
    normalized = new AppError(500, 'internal_error', 'The server could not complete this request.');
  }

  if (env.nodeEnv !== 'production' && normalized.status >= 500) console.error(error);
  response.status(normalized.status).json({
    success: false,
    message: normalized.message,
    error: {
      code: normalized.code,
      message: normalized.message,
      ...(normalized.details ? { details: normalized.details } : {}),
      ...(env.nodeEnv !== 'production' && normalized.status >= 500 ? { stack: error.stack } : {}),
    },
  });
};
