import { Check } from "lucide-react";

export const showSuccessToast = (toast: any, message: string) => {
  toast({
    className: "inline-flex h-8 items-center gap-2 rounded-md bg-background/60 px-3 backdrop-blur-sm",
    description: (
      <div className="flex items-center gap-2">
        <Check className="h-4 w-4 text-green-500" />
        <span className="text-sm">{message}</span>
      </div>
    ),
    duration: 2000,
  });
};