export const sendSuccess = (response, status, message, data = {}) => {
  response.status(status).json({ success: true, message, ...data });
};

