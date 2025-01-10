import { PostgrestError } from '@supabase/supabase-js';

export class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'APIError';
  }

  static fromPostgrestError(error: PostgrestError): APIError {
    return new APIError(
      error.message,
      error.code === 'PGRST116' ? 404 : 500,
      error.code,
      error.details
    );
  }
}

export class RateLimitError extends APIError {
  constructor(message = 'Too many requests. Please try again later.') {
    super(message, 429, 'RATE_LIMIT_EXCEEDED');
    this.name = 'RateLimitError';
  }
}

export class ValidationError extends APIError {
  constructor(message: string, details?: unknown) {
    super(message, 400, 'VALIDATION_ERROR', details);
    this.name = 'ValidationError';
  }
}

export function isPostgrestError(error: unknown): error is PostgrestError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'message' in error &&
    'details' in error
  );
}

export function handleAPIError(error: unknown): never {
  if (isPostgrestError(error)) {
    throw APIError.fromPostgrestError(error);
  }
  
  if (error instanceof APIError) {
    throw error;
  }
  
  throw new APIError(
    'An unexpected error occurred',
    500,
    'UNKNOWN_ERROR',
    error
  );
} 