import { Loader2 } from "lucide-react";

interface SelectionLoadingStateProps {
  message?: string;
}

export const SelectionLoadingState = ({ message = "Processing..." }: SelectionLoadingStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-6 bg-black/50 backdrop-blur-sm rounded-lg">
      <Loader2 className="h-8 w-8 animate-spin text-white" />
      <p className="text-white text-sm font-['Cinzel']">{message}</p>
    </div>
  );
};