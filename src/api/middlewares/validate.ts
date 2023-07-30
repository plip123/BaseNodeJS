import { Request, Response, NextFunction } from 'express';
import { ZodError, AnyZodObject } from 'zod';
import logger from '../../utils/pino';

export const validate =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        params: req.params,
        query: req.query,
        body: req.body,
      });

      next();
    } catch (err: any) {
      if (err instanceof ZodError) {
        logger.error("ERROR 400: Zod Validator");

        return res.status(400).json({
          status: 'fail',
          error: err.errors,
        });
      }
      next(err);
    }
  };
