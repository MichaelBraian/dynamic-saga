import * as React from "react"
import * as ToastPrimitives from "@radix-ui/react-toast"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

const ToastProvider = ToastPrimitives.Provider

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn("fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse items-center justify-center p-2", className)}
    {...props}
  />
))
ToastViewport.displayName = ToastPrimitives.Viewport.displayName

const toastVariants = cva(
  "group pointer-events-auto relative flex w-auto items-center justify-between space-x-1 overflow-hidden rounded-sm border p-1 shadow-sm transition-all",
  {
    variants: {
      variant: {
        default: "border bg-background/60 backdrop-blur-sm text-foreground",
        destructive: "destructive group border-destructive bg-destructive/60 backdrop-blur-sm text-destructive-foreground",
      },
    },
    defaultVariants: { variant: "default" },
  }
)

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> & VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => (
  <ToastPrimitives.Root ref={ref} className={cn(toastVariants({ variant }), className)} {...props} />
))
Toast.displayName = ToastPrimitives.Root.displayName

const baseTextStyles = "text-xs"
const ToastTitle = React.forwardRef<React.ElementRef<typeof ToastPrimitives.Title>, React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>>(
  ({ className, ...props }, ref) => <ToastPrimitives.Title ref={ref} className={cn(baseTextStyles, "font-medium", className)} {...props} />
)
ToastTitle.displayName = ToastPrimitives.Title.displayName

const ToastDescription = React.forwardRef<React.ElementRef<typeof ToastPrimitives.Description>, React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>>(
  ({ className, ...props }, ref) => <ToastPrimitives.Description ref={ref} className={cn(baseTextStyles, "opacity-90", className)} {...props} />
)
ToastDescription.displayName = ToastPrimitives.Description.displayName

const ToastClose = React.forwardRef<React.ElementRef<typeof ToastPrimitives.Close>, React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>>(
  ({ className, ...props }, ref) => (
    <ToastPrimitives.Close
      ref={ref}
      className={cn("absolute right-0 top-0 rounded-sm p-0.5 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:ring-1 group-hover:opacity-100", className)}
      toast-close=""
      {...props}
    >
      <X className="h-3 w-3" />
    </ToastPrimitives.Close>
  )
)
ToastClose.displayName = ToastPrimitives.Close.displayName

export type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>
export { ToastProvider, ToastViewport, Toast, ToastTitle, ToastDescription, ToastClose }