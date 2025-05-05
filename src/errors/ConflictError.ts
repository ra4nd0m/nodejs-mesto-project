import HttpError from './HttpError';

class ConflictError extends HttpError {
  constructor(message: string) {
    super(message, 409);
  }
}

export default ConflictError;
