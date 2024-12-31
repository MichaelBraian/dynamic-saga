import { Info } from "lucide-react";
import { CharacterSelectionScreen } from "./CharacterSelectionScreen";
import { useNavigate } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { CLASS_OPTIONS } from "@/data/classOptions";
import { createSuccessToast } from "@/utils/characterCreationToasts";

interface ClassSelectionProps {
  characterId: string;
  onBack: () => void;
}

export const ClassSelection = ({ characterId, onBack }: ClassSelectionProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSelected = () => {
    toast(createSuccessToast("Class selected"));
    navigate("/");
  };

  const classOptionsWithInfo = CLASS_OPTIONS.map(option => ({
    ...option,
    labelComponent: (
      <div className="flex items-center gap-2">
        {option.label}
        <Tooltip>
          <TooltipTrigger>
            <Info className="h-4 w-4 text-white/60 hover:text-white/80" />
          </TooltipTrigger>
          <TooltipContent className="max-w-[300px]">
            <p>{option.description}</p>
          </TooltipContent>
        </Tooltip>
      </div>
    ),
  }));

  return (
    <div className="pt-16">
      <CharacterSelectionScreen
        title="Choose Class"
        options={classOptionsWithInfo}
        characterId={characterId}
        onSelected={handleSelected}
        onBack={onBack}
        updateField="class"
        nextStatus="questioning"
      />
    </div>
  );
};