import { RateLimitError } from './errors';

interface RateLimiterOptions {
  maxRequests: number;
  windowMs: number;
}

export class RateLimiter {
  private requests: number = 0;
  private resetTime: number;

  constructor(private options: RateLimiterOptions) {
    this.resetTime = Date.now() + options.windowMs;
  }

  async checkLimit(): Promise<void> {
    const now = Date.now();

    if (now > this.resetTime) {
      this.requests = 0;
      this.resetTime = now + this.options.windowMs;
    }

    if (this.requests >= this.options.maxRequests) {
      const waitTime = Math.ceil((this.resetTime - now) / 1000);
      throw new RateLimitError(
        `Rate limit exceeded. Please try again in ${waitTime} seconds.`
      );
    }

    this.requests++;
  }
}

// Create a singleton instance with default values from environment
const MAX_REQUESTS = parseInt(
  import.meta.env.VITE_MAX_REQUESTS_PER_MINUTE || '60',
  10
);

export const globalRateLimiter = new RateLimiter({
  maxRequests: MAX_REQUESTS,
  windowMs: 60 * 1000, // 1 minute
}); 