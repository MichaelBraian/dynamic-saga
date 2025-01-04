import { useState, useRef, useEffect } from "react";
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
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentRoll && !isRolling && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [currentRoll, isRolling]);

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
    <div className="flex items-center justify-between p-4 bg-black/30 rounded-lg min-h-[5rem] relative z-0" ref={resultRef}>
      <div className="flex flex-col w-full">
        <div className="flex items-center gap-4 mb-1">
          <div className="w-5 flex-shrink-0">
            {icon}
          </div>
          <span className="text-white/60 text-sm w-8">{code}</span>
          <h3 className="text-lg font-['Cinzel'] text-white">{name}</h3>
          <InfoTooltip content={description} />
        </div>
        {(currentRoll || value !== undefined) && (
          <p className={cn(
            "text-2xl font-bold transition-all duration-200 ml-[3.25rem] relative",
            isRolling ? "text-yellow-400 animate-bounce" : "text-white"
          )}>
            {isRolling ? currentRoll : value}
          </p>
        )}
      </div>
      <Button
        onClick={handleRoll}
        disabled={value !== undefined || isRolling}
        className="bg-white/10 hover:bg-white/20 text-white border border-white/20 min-w-[80px] flex-shrink-0"
        variant="ghost"
      >
        {isRolling ? "Rolling..." : "Roll"}
      </Button>
    </div>
  );
};