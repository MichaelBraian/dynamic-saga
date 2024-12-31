import React from "react";
import { Check } from "lucide-react";
import { type ToastActionElement } from "@/components/ui/toast";

type ToastProps = {
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
  className?: string;
  variant?: "default" | "destructive";
};

export const createSuccessToast = (message: string): Partial<ToastProps> => ({
  className: "inline-flex h-8 items-center gap-2 rounded-md bg-background/60 px-3 backdrop-blur-sm",
  description: (
    <div className="flex items-center gap-2">
      <Check className="h-4 w-4 text-green-500" />
      <span className="text-sm">{message}</span>
    </div>
  ),
  duration: 2000,
});

export const createErrorToast = (title: string, description: string): Partial<ToastProps> => ({
  title,
  description,
  variant: "destructive",
  className: "inline-flex max-w-fit rounded-md bg-destructive px-3 py-2",
});