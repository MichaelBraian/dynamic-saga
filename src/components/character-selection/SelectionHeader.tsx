import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SelectionHeaderProps {
  title: string;
  onBack?: () => void;
  showBackButton?: boolean;
}

export const SelectionHeader = ({ title, onBack, showBackButton = true }: SelectionHeaderProps) => (
  <div className="flex items-center justify-between mb-8">
    {showBackButton && onBack && (
      <Button
        variant="ghost"
        size="icon"
        onClick={onBack}
        className="text-white hover:bg-white/20"
      >
        <ArrowLeft className="h-6 w-6" />
      </Button>
    )}
    <h1 className="text-3xl font-['Cinzel'] text-center flex-1 text-white">{title}</h1>
    {showBackButton && onBack && <div className="w-10" />}
  </div>
);