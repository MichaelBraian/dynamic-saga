import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface ContinueButtonProps {
  onClick: () => void;
}

export const ContinueButton = ({ onClick }: ContinueButtonProps) => {
  return (
    <div className="flex justify-center mt-8">
      <Button
        onClick={onClick}
        className="w-full bg-white/20 hover:bg-white/30 text-white font-['Cinzel'] text-lg py-6 px-8 shadow-lg flex items-center justify-center gap-2"
      >
        Continue to Attributes
        <ArrowRight className="w-6 h-6" />
      </Button>
    </div>
  );
};