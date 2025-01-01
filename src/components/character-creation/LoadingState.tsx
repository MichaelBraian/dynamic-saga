import { LoadingSpinner } from "../shared/LoadingSpinner";

interface LoadingStateProps {
  message?: string;
}

export const LoadingState = ({ message = "Loading..." }: LoadingStateProps) => (
  <div className="flex flex-col items-center justify-center space-y-4 p-6 bg-black/50 backdrop-blur-sm rounded-lg">
    <LoadingSpinner />
    <p className="text-white text-sm font-['Cinzel']">{message}</p>
  </div>
);