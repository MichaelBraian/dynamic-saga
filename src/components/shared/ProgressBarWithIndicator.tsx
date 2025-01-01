import { Progress } from "@/components/ui/progress";
import { ArrowBigDown } from "lucide-react";

interface ProgressBarWithIndicatorProps {
  value: number;
  leftLabel: string;
  rightLabel: string;
  description?: string;
  height?: "sm" | "md" | "lg";
  showArrow?: boolean;
}

const heightClasses = {
  sm: "h-6",
  md: "h-8",
  lg: "h-10",
};

export const ProgressBarWithIndicator = ({
  value,
  leftLabel,
  rightLabel,
  description,
  height = "md",
  showArrow = true,
}: ProgressBarWithIndicatorProps) => {
  // Ensure value is between 0 and 100
  const normalizedValue = Math.max(0, Math.min(100, value));

  return (
    <div className="space-y-2">
      {showArrow && (
        <div className="relative">
          <div 
            style={{ marginLeft: `${normalizedValue}%` }} 
            className="relative flex justify-center transform -translate-x-1/2"
          >
            <ArrowBigDown className="text-white w-8 h-8" />
          </div>
        </div>
      )}
      
      <div className="relative">
        <Progress 
          value={normalizedValue} 
          className={heightClasses[height]}
          showIndicator
        />
        <div className="flex justify-between mt-2">
          <span className="text-white/80 font-['IM_Fell_English'] text-lg tracking-wide hover:text-white transition-colors">
            {leftLabel}
          </span>
          <span className="text-white/80 font-['IM_Fell_English'] text-lg tracking-wide hover:text-white transition-colors">
            {rightLabel}
          </span>
        </div>
      </div>
      
      {description && (
        <p className="text-sm opacity-80 text-white">{description}</p>
      )}
    </div>
  );
};