import { ProgressBarWithIndicator } from "@/components/shared/ProgressBarWithIndicator";

interface MoralityScaleProps {
  value: number;
  type: 'goodEvil' | 'lawfulChaotic';
}

export const MoralityScale = ({ value, type }: MoralityScaleProps) => {
  const getScaleDescription = (value: number, type: 'goodEvil' | 'lawfulChaotic') => {
    if (type === 'goodEvil') {
      if (value >= 75) return "Pure Good - You embody virtue and compassion";
      if (value >= 25) return "Somewhat Good - You tend to do the right thing";
      if (value >= -25) return "Neutral - You balance between good and evil";
      if (value >= -75) return "Somewhat Evil - You're willing to harm others for gain";
      return "Pure Evil - You actively pursue destruction and suffering";
    } else {
      if (value >= 75) return "Pure Lawful - You strictly follow rules and honor";
      if (value >= 25) return "Somewhat Lawful - You respect order but can be flexible";
      if (value >= -25) return "Neutral - You balance between order and chaos";
      if (value >= -75) return "Somewhat Chaotic - You follow your own path";
      return "Pure Chaotic - You reject all constraints and order";
    }
  };
  
  const labels = type === 'goodEvil' 
    ? { left: "Evil", right: "Good" }
    : { left: "Chaotic", right: "Lawful" };

  // Normalize the value from -100 to 100 scale to 0 to 100 scale for the progress bar
  const normalizedValue = ((value + 100) / 2);

  return (
    <div className="w-full">
      <ProgressBarWithIndicator
        value={normalizedValue}
        leftLabel={labels.left}
        rightLabel={labels.right}
        description={getScaleDescription(value, type)}
        height="md"
      />
    </div>
  );
};