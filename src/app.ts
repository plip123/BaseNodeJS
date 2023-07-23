import express, { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import config from 'config';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import logger from '../config/pino';

const app = express();

//
// Middleware
//

// Body Parser
app.use(express.json({ limit: '10kb' }));

// Cookie Parser
app.use(cookieParser());

// Cors
app.use(
  cors({
    origin: config.get<string>('origin'),
    credentials: true,
  })
);

// Logger
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));
  
// Testing
app.get('/healthChecker', (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    status: 'success',
    message: 'Welcome to Plip',
  });
});

// Routes Not Found
app.all('*', (req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Route ${req.originalUrl} not found`) as any;
  err.statusCode = 404;
  next(err);
});

// Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  err.status = err.status || 'error';
  err.statusCode = err.statusCode || 500;

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

const port = config.get<number>('port');
app.listen(port, () => {
  logger.info(`
    ######################################
    ♦  Server listening on port: ${port} ♦
    ######################################
  `);
}).on('error', err => {
  logger.error(err);
  process.exit(1);
});