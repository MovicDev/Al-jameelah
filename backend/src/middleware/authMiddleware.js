import { User } from '../models/User.js';
import { AppError } from '../utils/AppError.js';
import { verifyToken } from '../services/tokenService.js';

export const authenticate = async (request, _response, next) => {
  const [scheme, token] = (request.headers.authorization ?? '').split(' ');
  if (scheme !== 'Bearer' || !token) return next(new AppError(401, 'missing_token', 'Authentication is required.'));
  try {
    const payload = verifyToken(token);
    const user = await User.findById(payload.sub);
    if (!user) throw new AppError(401, 'invalid_token', 'This session is no longer valid.');
    request.user = user;
    next();
  } catch (error) {
    if (error instanceof AppError) return next(error);
    const code = error.name === 'TokenExpiredError' ? 'expired_token' : 'invalid_token';
    return next(new AppError(401, code, code === 'expired_token' ? 'Your session has expired.' : 'The supplied token is invalid.'));
  }
};

export const optionalAuthenticate = async (request, _response, next) => {
  if (!request.headers.authorization) return next();
  return authenticate(request, _response, next);
};

export const requireAdmin = (request, _response, next) => {
  if (request.user?.role !== 'admin') return next(new AppError(403, 'admin_required', 'Administrator access is required.'));
  next();
};
