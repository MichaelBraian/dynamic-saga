import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface AttributesHeaderProps {
  onBack: () => void;
}

export const AttributesHeader = ({ onBack }: AttributesHeaderProps) => (
  <div className="flex items-center mb-6">
    <Button
      variant="ghost"
      size="icon"
      onClick={onBack}
      className="text-white hover:bg-white/20 mr-2"
    >
      <ArrowLeft className="h-6 w-6" />
    </Button>
    <h2 className="text-2xl font-['Cinzel'] text-white">Character Attributes</h2>
  </div>
);