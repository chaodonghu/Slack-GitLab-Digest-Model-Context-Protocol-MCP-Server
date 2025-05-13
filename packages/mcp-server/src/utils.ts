// src/utils.ts
export function parseTimeRange(timeframe: string): [number, number] {
  const now = new Date();
  let start: Date;
  let end: Date = now;
  
  switch (timeframe.toLowerCase()) {
    case 'today':
      start = new Date(now);
      start.setHours(0, 0, 0, 0);
      break;
    case 'yesterday':
      start = new Date(now);
      start.setDate(start.getDate() - 1);
      start.setHours(0, 0, 0, 0);
      end = new Date(now);
      end.setDate(end.getDate() - 1);
      end.setHours(23, 59, 59, 999);
      break;
    case 'day_before_yesterday':
      start = new Date(now);
      start.setDate(start.getDate() - 2);
      start.setHours(0, 0, 0, 0);
      end = new Date(now);
      end.setDate(end.getDate() - 2);
      end.setHours(23, 59, 59, 999);
      break;
    case 'last_week':
      start = new Date(now);
      start.setDate(start.getDate() - 7);
      start.setHours(0, 0, 0, 0);
      break;
    default:
      // Default to last 24 hours
      start = new Date(now);
      start.setDate(start.getDate() - 1);
  }
  
  // Convert to UNIX timestamps (seconds)
  return [Math.floor(start.getTime() / 1000), Math.floor(end.getTime() / 1000)];
}

/**
 * Custom API error class
 */
export class ApiError extends Error {
  statusCode: number;
  
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ApiError';
  }
}

/**
 * Format an error response
 */
export function formatErrorResponse(err: unknown) {
  if (err instanceof ApiError) {
    return {
      error: err.name,
      message: err.message,
      statusCode: err.statusCode
    };
  }
  
  return {
    error: 'UnknownError',
    message: err instanceof Error ? err.message : 'An unknown error occurred',
    statusCode: 500
  };
}
