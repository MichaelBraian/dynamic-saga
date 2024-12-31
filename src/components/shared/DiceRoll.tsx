import { useState, useEffect } from 'react';
import { Dice6 } from 'lucide-react';

interface DiceRollProps {
  onRollComplete: (total: number) => void;
}

export const DiceRoll = ({ onRollComplete }: DiceRollProps) => {
  const [isRolling, setIsRolling] = useState(false);
  const [dice1, setDice1] = useState(1);
  const [dice2, setDice2] = useState(1);

  const rollDice = () => {
    if (isRolling) return;
    
    setIsRolling(true);
    
    let rolls = 0;
    const maxRolls = 10;
    const rollInterval = setInterval(() => {
      setDice1(Math.floor(Math.random() * 6) + 1);
      setDice2(Math.floor(Math.random() * 6) + 1);
      
      rolls++;
      if (rolls >= maxRolls) {
        clearInterval(rollInterval);
        const finalDice1 = Math.floor(Math.random() * 6) + 1;
        const finalDice2 = Math.floor(Math.random() * 6) + 1;
        setDice1(finalDice1);
        setDice2(finalDice2);
        setTimeout(() => {
          setIsRolling(false);
          onRollComplete(finalDice1 + finalDice2);
        }, 500);
      }
    }, 100);
  };

  return isRolling ? (
    <div className="flex gap-1 items-center animate-bounce">
      <Dice6 
        className={`h-5 w-5 text-white animate-spin`}
        data-value={dice1}
      />
      <Dice6 
        className={`h-5 w-5 text-white animate-spin`}
        data-value={dice2}
      />
    </div>
  ) : (
    <div 
      className="flex gap-1 items-center cursor-pointer hover:opacity-80 transition-opacity"
      onClick={rollDice}
    >
      <Dice6 className="h-5 w-5 text-white" />
      <Dice6 className="h-5 w-5 text-white" />
    </div>
  );
};