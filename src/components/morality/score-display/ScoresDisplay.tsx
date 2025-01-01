import { AlignmentScore } from "./AlignmentScore";
import { MoralityScale } from "./MoralityScale";

interface ScoresDisplayProps {
  alignmentScore: number;
  goodEvilScale: number;
  lawfulChaoticScale: number;
}

export const ScoresDisplay = ({ 
  alignmentScore,
  goodEvilScale,
  lawfulChaoticScale 
}: ScoresDisplayProps) => {
  return (
    <div className="space-y-8 text-white">
      <div>
        <AlignmentScore score={alignmentScore} />
      </div>

      <div>
        <MoralityScale 
          value={goodEvilScale} 
          type="goodEvil" 
        />
      </div>

      <div>
        <MoralityScale 
          value={lawfulChaoticScale} 
          type="lawfulChaotic" 
        />
      </div>
    </div>
  );
};