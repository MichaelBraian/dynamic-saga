import { ProgressBarWithIndicator } from "@/components/shared/ProgressBarWithIndicator";

interface AlignmentScoreProps {
  score: number;
}

export const AlignmentScore = ({ score }: AlignmentScoreProps) => {
  const getAlignmentDescription = (score: number) => {
    if (score >= 75) return "Angelic - You embody virtue and righteousness";
    if (score >= 50) return "Noble - You tend towards good and order";
    if (score >= 25) return "Moderate - You balance between light and dark";
    return "Devilish - You embrace darkness and chaos";
  };

  return (
    <ProgressBarWithIndicator
      value={score}
      leftLabel="Devil"
      rightLabel="Angel"
      description={getAlignmentDescription(score)}
      height="lg"
    />
  );
};