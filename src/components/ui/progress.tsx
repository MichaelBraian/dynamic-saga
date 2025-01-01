import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & { showIndicator?: boolean }
>(({ className, value, showIndicator = false, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-4 w-full overflow-hidden rounded-full bg-black/20 backdrop-blur-sm",
      className
    )}
    {...props}
  >
    <div className="relative w-full h-full">
      <ProgressPrimitive.Indicator
        className="h-full flex-1 transition-all bg-white/10"
        style={{ 
          width: `calc(${value || 0}% + 4px)`,
          transform: `translateX(-4px)`
        }}
      />
      {showIndicator && (
        <div 
          className="absolute top-0 bottom-0 w-[2px] bg-white"
          style={{ 
            boxShadow: '0 0 4px rgba(255, 255, 255, 0.5)',
            right: '0'
          }}
        />
      )}
    </div>
  </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }