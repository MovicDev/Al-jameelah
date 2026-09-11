import * as authService from '../services/authService.js';
import { serializeProfile } from '../serializers/index.js';
import { sendSuccess } from '../utils/respond.js';

export const register = async (request, response) => {
  const result = await authService.register(request.validated.body);
  sendSuccess(response, 201, 'Account created successfully.', { session: result.session, profile: serializeProfile(result.user) });
};
export const login = async (request, response) => {
  const result = await authService.login(request.validated.body);
  sendSuccess(response, 200, 'Signed in successfully.', { session: result.session, profile: serializeProfile(result.user) });
};
export const me = async (request, response) => sendSuccess(response, 200, 'Current user loaded.', {
  user: { id: request.user.id, email: request.user.email },
  profile: serializeProfile(request.user),
});
export const logout = async (_request, response) => sendSuccess(response, 200, 'Signed out successfully. Discard the bearer token on the client.');
export const forgotPassword = async (request, response) => {
  await authService.requestPasswordReset(request.validated.body.email);
  sendSuccess(response, 200, 'If that email exists, a password-reset link has been sent.');
};
export const resetPassword = async (request, response) => {
  await authService.resetPassword(request.validated.body);
  sendSuccess(response, 200, 'Password updated successfully.');
};

