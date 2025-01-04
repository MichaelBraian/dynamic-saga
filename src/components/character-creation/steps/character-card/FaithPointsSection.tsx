import { Flame } from "lucide-react";
import { InfoTooltip } from "@/components/shared/InfoTooltip";

interface FaithPointsSectionProps {
  faithPoints: number;
}

export const FaithPointsSection = ({ faithPoints }: FaithPointsSectionProps) => {
  return (
    <div className="space-y-4">
      {/* Header with tooltip */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Flame className="h-5 w-5 text-yellow-400" />
          <span className="text-white/80">Faith Points</span>
        </div>
        <InfoTooltip content="Faith Points represent your character's connection to divine power. Use them to activate powerful abilities and blessings." />
      </div>

      {/* Faith Points Display */}
      <div className="flex justify-center items-center gap-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
              i < faithPoints
                ? "border-yellow-400 bg-yellow-400/20"
                : "border-white/20 bg-black/20"
            }`}
          >
            <Flame
              className={`h-6 w-6 transition-colors ${
                i < faithPoints ? "text-yellow-400" : "text-white/20"
              }`}
            />
          </div>
        ))}
      </div>

      {/* Description */}
      <div className="text-center">
        <div className="text-lg font-bold text-yellow-400">
          {faithPoints} / 3
        </div>
        <div className="text-sm text-white/60">
          Available Faith Points
        </div>
      </div>
    </div>
  );
}; 