import { AppError } from '../utils/AppError.js';

export const validate = (schema) => (request, _response, next) => {
  const result = schema.safeParse({ body: request.body, params: request.params, query: request.query });
  if (!result.success) {
    return next(new AppError(422, 'validation_error', 'The submitted data is invalid.',
      result.error.issues.map((issue) => ({ path: issue.path.join('.'), message: issue.message }))));
  }
  request.validated = result.data;
  next();
};

