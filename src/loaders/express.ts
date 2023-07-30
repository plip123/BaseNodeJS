import express, { Express, Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import config from 'config';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import routes from '../api';

export default ({ app } : { app: Express }) => {
  /**
   * Middlewares
   */

  /// Body Parser
  app.use(express.json({ limit: '10kb' }));

  /// Cookie Parser
  app.use(cookieParser());

  // Useful if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
  // It shows the real origin IP in the heroku or Cloudwatch logs
  app.enable('trust proxy');

  /// Cors
  app.use(
    cors({
      origin: config.get<string>('origin'),
      credentials: true,
    })
  );

  /// Load API routes
  app.use(config.get<string>('api.prefix'), routes());

  /// Handle Error
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    err.status = err.status || 'error';
    err.statusCode = err.statusCode || 500;

    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  });

  /// Logger
  if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

  /**
   * Health Check endpoints
   */
  app.get('/status', (req, res) => {
    res.status(200).json({
      status: 'success',
      message: 'Welcome to Plip',
    });
  });
  app.head('/status', (req, res) => {
    res.status(200).end();
  });

  
  /// Catch 404 and forward to error handler
  app.all('*', (req: Request, res: Response, next: NextFunction) => {
    const err = new Error(`Route ${req.originalUrl} not found`) as any;
    err.statusCode = 404;
    next(err);
  });
  
  
  /**
   * Error Handler
   */
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    /**
     * Handle 401 thrown by express-jwt library
     */
    if (err.name === 'UnauthorizedError') {
      return res
        .status(err.status)
        .send({ message: err.message })
        .end();
    }
    return next(err);
  });

  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    err.status = err.status || 'error';
    err.statusCode = err.statusCode || 500;

    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  });
};
