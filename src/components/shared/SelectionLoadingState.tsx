import { LoadingSpinner } from "./LoadingSpinner";

interface SelectionLoadingStateProps {
  message?: string;
}

export const SelectionLoadingState = ({ 
  message = "Processing..." 
}: SelectionLoadingStateProps) => (
  <div className="flex flex-col items-center justify-center min-h-[300px] space-y-4 p-6 bg-black/50 backdrop-blur-sm rounded-lg">
    <LoadingSpinner />
    <p className="text-white text-sm font-['Cinzel']">{message}</p>
  </div>
);