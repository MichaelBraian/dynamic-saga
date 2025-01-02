import { useState, useCallback, useEffect } from "react";
import { HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider
} from "@/components/ui/tooltip";
import { useMediaQuery } from "@/hooks/useMediaQuery";

interface InfoTooltipProps {
  content: string;
}

export const InfoTooltip = ({ content }: InfoTooltipProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 640px)");

  const handleToggle = useCallback((event: React.MouseEvent | React.TouchEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setIsOpen(prev => !prev);
  }, []);

  // Close tooltip when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (event: MouseEvent | TouchEvent) => {
      event.preventDefault();
      event.stopPropagation();
      setIsOpen(false);
    };

    // Add invisible overlay to prevent button selection
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.right = '0';
    overlay.style.bottom = '0';
    overlay.style.zIndex = '999';
    overlay.style.pointerEvents = 'auto';
    overlay.addEventListener('click', handleOutsideClick);
    overlay.addEventListener('touchstart', handleOutsideClick);
    document.body.appendChild(overlay);

    return () => {
      document.body.removeChild(overlay);
      overlay.removeEventListener('click', handleOutsideClick);
      overlay.removeEventListener('touchstart', handleOutsideClick);
    };
  }, [isOpen]);

  return (
    <TooltipProvider>
      <Tooltip 
        open={isOpen}
        onOpenChange={setIsOpen}
        delayDuration={0}
      >
        <TooltipTrigger asChild>
          <button 
            type="button" 
            className="touch-none cursor-help rounded-full p-2 transition-colors hover:bg-white/10 active:bg-white/20 sm:p-1"
            aria-label={`Information about ${content}`}
            onClick={handleToggle}
            onTouchStart={isMobile ? handleToggle : undefined}
          >
            <HelpCircle className="h-6 w-6 text-white/60 transition-colors hover:text-white/80 sm:h-5 sm:w-5" />
          </button>
        </TooltipTrigger>
        <TooltipContent 
          side="bottom"
          align="center"
          className="z-[1000] max-w-[280px] bg-black/95 text-sm text-white shadow-xl backdrop-blur-sm border-white/20 sm:max-w-[300px] touch-none"
          sideOffset={2}
          alignOffset={0}
          collisionBoundary={document.body}
          collisionPadding={16}
          sticky="always"
          avoidCollisions={true}
        >
          <p className="px-1">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};