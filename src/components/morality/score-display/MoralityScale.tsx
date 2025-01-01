import { ProgressBarWithIndicator } from "@/components/shared/ProgressBarWithIndicator";

interface MoralityScaleProps {
  value: number;
  type: 'goodEvil' | 'lawfulChaotic';
}

export const MoralityScale = ({ value, type }: MoralityScaleProps) => {
  const getScaleDescription = (value: number, type: 'goodEvil' | 'lawfulChaotic') => {
    if (type === 'goodEvil') {
      if (value > 50) return "Strongly Good - You prioritize helping others";
      if (value > 0) return "Somewhat Good - You tend to do the right thing";
      if (value > -50) return "Somewhat Evil - You're willing to harm others for gain";
      return "Strongly Evil - You actively pursue destructive goals";
    } else {
      if (value > 50) return "Highly Lawful - You strictly follow rules and tradition";
      if (value > 0) return "Somewhat Lawful - You respect order but can be flexible";
      if (value > -50) return "Somewhat Chaotic - You follow your own path";
      return "Highly Chaotic - You reject all constraints and order";
    }
  };

  const labels = type === 'goodEvil' 
    ? { left: "Evil", right: "Good" }
    : { left: "Chaotic", right: "Lawful" };

  return (
    <ProgressBarWithIndicator
      value={(value + 100) / 2}
      leftLabel={labels.left}
      rightLabel={labels.right}
      description={getScaleDescription(value, type)}
      height="md"
    />
  );
};