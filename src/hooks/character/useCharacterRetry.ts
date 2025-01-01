import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface RetryConfig {
  maxAttempts?: number;
  delayMs?: number;
}

export const useCharacterRetry = () => {
  const [isRetrying, setIsRetrying] = useState(false);
  const { toast } = useToast();

  const retryOperation = async <T>(
    operation: () => Promise<T>,
    config: RetryConfig = { maxAttempts: 3, delayMs: 1000 }
  ): Promise<T | null> => {
    const { maxAttempts = 3, delayMs = 1000 } = config;
    let attempts = 0;

    while (attempts < maxAttempts) {
      try {
        setIsRetrying(attempts > 0);
        const result = await operation();
        setIsRetrying(false);
        return result;
      } catch (error) {
        attempts++;
        if (attempts === maxAttempts) {
          console.error('Operation failed after max attempts:', error);
          toast({
            variant: "destructive",
            description: "Operation failed. Please try again.",
          });
          setIsRetrying(false);
          return null;
        }
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
    return null;
  };

  return {
    retryOperation,
    isRetrying
  };
};