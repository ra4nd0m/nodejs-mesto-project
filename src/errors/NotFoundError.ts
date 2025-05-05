import HttpError from './HttpError';

class NotFoundError extends HttpError {
  constructor(message: string) {
    super(message, 404);
  }
}

export default NotFoundError;
