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
  <Tooltip delayDuration={0}>
    <TooltipTrigger asChild>
      <button 
        type="button" 
        className="cursor-help p-1 hover:bg-white/10 rounded-full transition-colors"
        aria-label="More information"
      >
        <HelpCircle className="h-5 w-5 text-white/60 hover:text-white/80" />
      </button>
    </TooltipTrigger>
    <TooltipContent side="bottom" className="max-w-[300px] bg-black/90 text-white border-white/20">
      <p>{content}</p>
    </TooltipContent>
  </Tooltip>
);