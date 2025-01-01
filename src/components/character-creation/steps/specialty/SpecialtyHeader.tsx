import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SpecialtyHeaderProps {
  onBack: () => void;
}

export const SpecialtyHeader = ({ onBack }: SpecialtyHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-8">
      <Button
        variant="ghost"
        size="icon"
        onClick={onBack}
        className="text-white hover:bg-white/20"
      >
        <ArrowLeft className="h-6 w-6" />
      </Button>
      <h1 className="text-3xl font-['Cinzel'] text-center flex-1 text-white">
        Choose Your Specialty
      </h1>
      <div className="w-10" />
    </div>
  );
};