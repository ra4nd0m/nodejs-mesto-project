import HttpError from './HttpError';

class UnauthorizedError extends HttpError {
  constructor(message: string) {
    super(message, 401);
  }
}

export default UnauthorizedError;
