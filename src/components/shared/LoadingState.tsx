import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  message?: string;
}

export const LoadingState = ({ message = "Loading..." }: LoadingStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-6">
      <Loader2 className="h-8 w-8 animate-spin text-white" />
      <p className="text-white text-sm">{message}</p>
    </div>
  );
};