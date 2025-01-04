import { Scale, Sword } from "lucide-react";
import { cn } from "@/lib/utils";
import { MoralityScoreProps } from "./types";

export const MoralityDisplay = ({
  alignmentScore,
  goodEvilScale,
  lawfulChaoticScale
}: MoralityScoreProps) => {
  const getAlignmentText = (score: number) => {
    if (score >= 80) return "Paragon";
    if (score >= 60) return "Noble";
    if (score >= 40) return "Neutral";
    if (score >= 20) return "Wicked";
    return "Villainous";
  };

  const getGoodEvilText = (scale: number) => {
    if (scale >= 70) return "Good";
    if (scale >= 30) return "Neutral Good";
    if (scale >= -30) return "Neutral";
    if (scale >= -70) return "Neutral Evil";
    return "Evil";
  };

  const getLawfulChaoticText = (scale: number) => {
    if (scale >= 70) return "Lawful";
    if (scale >= 30) return "Neutral Lawful";
    if (scale >= -30) return "Neutral";
    if (scale >= -70) return "Neutral Chaotic";
    return "Chaotic";
  };

  return (
    <div className="space-y-4">
      {/* Alignment Score */}
      <div className="bg-black/20 p-3 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Sword className="h-5 w-5 text-white/80" />
          <span className="text-sm text-white/60">Alignment</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-xl font-bold text-white">
            {getAlignmentText(alignmentScore)}
          </div>
          <div className="text-sm text-white/60">
            {alignmentScore}/100
          </div>
        </div>
        {/* Progress bar */}
        <div className="mt-2 h-2 bg-black/30 rounded-full overflow-hidden">
          <div 
            className={cn(
              "h-full rounded-full transition-all",
              alignmentScore >= 80 ? "bg-blue-500" :
              alignmentScore >= 60 ? "bg-green-500" :
              alignmentScore >= 40 ? "bg-yellow-500" :
              alignmentScore >= 20 ? "bg-orange-500" :
              "bg-red-500"
            )}
            style={{ width: `${alignmentScore}%` }}
          />
        </div>
      </div>

      {/* Scales */}
      <div className="grid grid-cols-2 gap-3">
        {/* Good-Evil Scale */}
        <div className="bg-black/20 p-3 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Scale className="h-5 w-5 text-white/80" />
            <span className="text-sm text-white/60">Good-Evil</span>
          </div>
          <div className="text-lg font-bold text-white">
            {getGoodEvilText(goodEvilScale)}
          </div>
          {/* Scale bar */}
          <div className="mt-2 h-2 bg-black/30 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"
              style={{ width: `${((goodEvilScale + 100) / 2)}%` }}
            />
          </div>
        </div>

        {/* Lawful-Chaotic Scale */}
        <div className="bg-black/20 p-3 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Scale className="h-5 w-5 text-white/80" />
            <span className="text-sm text-white/60">Lawful-Chaotic</span>
          </div>
          <div className="text-lg font-bold text-white">
            {getLawfulChaoticText(lawfulChaoticScale)}
          </div>
          {/* Scale bar */}
          <div className="mt-2 h-2 bg-black/30 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500"
              style={{ width: `${((lawfulChaoticScale + 100) / 2)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}; 