import fs from 'fs';
import path from 'path';

const LOG_DIR = path.join(__dirname, '../../logs');

if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

const requestLogPath = path.join(LOG_DIR, 'request.log');
const errorLogPath = path.join(LOG_DIR, 'error.log');

export const logRequest = (req: any) => {
  const { method, url, body } = req;
  const logData = JSON.stringify({
    timestamp: new Date().toISOString(),
    method,
    url,
    body: method === 'POST' || method === 'PATCH' ? body : undefined,
  })

  fs.appendFileSync(requestLogPath, logData + '\n');
};

export const logError = (err: any, req: any) => {
  const { method, url, body } = req;
  const logData = JSON.stringify({
    timestamp: new Date().toISOString(),
    method,
    url,
    body,
    error: {
      message: err.message,
      stack: err.stack,
      code: err.code,
    },
  });

  fs.appendFileSync(errorLogPath, logData + '\n');
}
