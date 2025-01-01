import { HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface InfoTooltipProps {
  content: string;
}

export const InfoTooltip = ({ content }: InfoTooltipProps) => (
  <Tooltip delayDuration={200}>
    <TooltipTrigger asChild>
      <button 
        type="button" 
        className="touch-manipulation cursor-help rounded-full p-2 transition-colors hover:bg-white/10 active:bg-white/20 sm:p-1"
        aria-label="More information"
      >
        <HelpCircle className="h-6 w-6 text-white/60 transition-colors hover:text-white/80 sm:h-5 sm:w-5" />
      </button>
    </TooltipTrigger>
    <TooltipContent 
      side="bottom" 
      align="center"
      className="max-w-[280px] bg-black/95 text-sm text-white shadow-xl backdrop-blur-sm border-white/20 sm:max-w-[300px]"
      sideOffset={8}
    >
      <p className="px-1">{content}</p>
    </TooltipContent>
  </Tooltip>
);