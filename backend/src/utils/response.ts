import { Response } from 'express';

export const sendSuccess = (
  res: Response,
  message: string,
  data: any = null,
  statusCode: number = 200
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  });
};

export const sendError = (
  res: Response,
  message: string,
  errorDetails: any = null,
  statusCode: number = 400
) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors: errorDetails,
    timestamp: new Date().toISOString(),
  });
};
