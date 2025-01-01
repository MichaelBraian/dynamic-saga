import { useState } from "react";
import { Button } from "@/components/ui/button";
import { InfoTooltip } from "@/components/shared/InfoTooltip";
import { cn } from "@/lib/utils";

interface AttributeItemProps {
  name: string;
  code: string;
  icon: React.ReactNode;
  description: string;
  value: number | undefined;
  onRollComplete: (value: number) => void;
}

export const AttributeItem = ({ 
  name, 
  code,
  icon,
  description, 
  value, 
  onRollComplete 
}: AttributeItemProps) => {
  const [isRolling, setIsRolling] = useState(false);
  const [currentRoll, setCurrentRoll] = useState<number | null>(null);

  const handleRoll = async () => {
    setIsRolling(true);

    // Animate through random numbers
    for (let i = 0; i < 10; i++) {
      const dice1 = Math.floor(Math.random() * 6) + 1;
      const dice2 = Math.floor(Math.random() * 6) + 1;
      const roll = dice1 + dice2;
      setCurrentRoll(roll);
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Final roll
    const finalDice1 = Math.floor(Math.random() * 6) + 1;
    const finalDice2 = Math.floor(Math.random() * 6) + 1;
    const finalRoll = finalDice1 + finalDice2;
    setCurrentRoll(finalRoll);
    onRollComplete(finalRoll);
    setIsRolling(false);
  };

  return (
    <div className="flex items-center justify-between p-3 bg-black/60 backdrop-blur-sm rounded-lg">
      <div className="flex flex-col flex-1 mr-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-white/60 text-sm">{code}</span>
          {icon}
          <h3 className="text-xl font-['Cinzel'] text-white">{name}</h3>
          <InfoTooltip content={description} />
        </div>
        <div className="flex items-center">
          {(currentRoll || value !== undefined) && (
            <p className={cn(
              "text-3xl font-bold transition-all duration-200",
              isRolling ? "text-yellow-400 animate-bounce" : "text-white"
            )}>
              {isRolling ? currentRoll : value}
            </p>
          )}
        </div>
      </div>
      <Button
        onClick={handleRoll}
        disabled={value !== undefined || isRolling}
        className="bg-black/40 hover:bg-black/60 text-white/80 hover:text-white px-6 shrink-0"
        variant="ghost"
      >
        {isRolling ? "Rolling..." : "Roll"}
      </Button>
    </div>
  );
};