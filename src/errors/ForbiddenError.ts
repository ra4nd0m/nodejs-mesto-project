import HttpError from './HttpError';

class ForbiddenError extends HttpError {
  constructor(message: string) {
    super(message, 403);
  }
}

export default ForbiddenError;
