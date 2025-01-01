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
  console.log('Rendering scores:', { alignmentScore, goodEvilScale, lawfulChaoticScale });
  
  return (
    <div className="space-y-8 text-white">
      <div>
        <h3 className="text-lg font-semibold mb-2">Overall Alignment</h3>
        <AlignmentScore score={alignmentScore} />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Good vs Evil</h3>
        <MoralityScale 
          value={goodEvilScale} 
          type="goodEvil" 
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Law vs Chaos</h3>
        <MoralityScale 
          value={lawfulChaoticScale} 
          type="lawfulChaotic" 
        />
      </div>
    </div>
  );
};