import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface ContinueButtonProps {
  onClick: () => void;
  disabled: boolean;
  isSaving: boolean;
}

export const ContinueButton = ({ onClick, disabled, isSaving }: ContinueButtonProps) => (
  <div className="flex justify-center mt-6">
    <Button
      onClick={onClick}
      disabled={disabled}
      className="bg-white/10 text-white hover:bg-white/20"
    >
      {isSaving ? 'Saving...' : 'Continue'} <ArrowRight className="ml-2" />
    </Button>
  </div>
);