import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dice1 } from "lucide-react";

interface AttributeItemProps {
  name: string;
  value: number | undefined;
  onRollComplete: (value: number) => void;
}

export const AttributeItem = ({ name, value, onRollComplete }: AttributeItemProps) => {
  const [isRolling, setIsRolling] = useState(false);

  const handleRoll = () => {
    setIsRolling(true);
    // Simulate two d6 dice rolls (2-12 range)
    setTimeout(() => {
      const dice1 = Math.floor(Math.random() * 6) + 1;
      const dice2 = Math.floor(Math.random() * 6) + 1;
      const rollResult = dice1 + dice2;
      onRollComplete(rollResult);
      setIsRolling(false);
    }, 1000);
  };

  return (
    <div className="flex items-center justify-between p-4 bg-black/30 rounded-lg">
      <div>
        <h3 className="capitalize text-lg font-['Cinzel'] text-white">{name}</h3>
        <p className="text-2xl font-bold text-white">
          {value !== undefined ? value : "-"}
        </p>
      </div>
      <Button
        onClick={handleRoll}
        disabled={value !== undefined || isRolling}
        className="bg-white/10 text-white hover:bg-white/20"
      >
        <Dice1 className={isRolling ? "animate-spin" : ""} />
        {isRolling ? "Rolling..." : "Roll"}
      </Button>
    </div>
  );
};