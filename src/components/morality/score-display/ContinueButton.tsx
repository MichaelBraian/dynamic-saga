import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface ContinueButtonProps {
  onClick: () => Promise<void>;
}

export const ContinueButton = ({ onClick }: ContinueButtonProps) => {
  return (
    <div className="flex justify-center mt-8">
      <Button
        onClick={onClick}
        className="bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm text-lg py-6 px-8 shadow-lg"
      >
        Continue to Attributes <ArrowRight className="ml-2 w-6 h-6" />
      </Button>
    </div>
  );
};