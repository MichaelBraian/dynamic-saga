import { Button } from "@/components/ui/button";

interface SpecialtyStateDisplayProps {
  isLoading?: boolean;
  attributesIncomplete?: boolean;
  onBack?: () => void;
}

export const SpecialtyStateDisplay = ({
  isLoading,
  attributesIncomplete,
  onBack,
}: SpecialtyStateDisplayProps) => {
  if (isLoading) {
    return (
      <div className="w-full max-w-2xl mx-auto p-6 bg-black/50 backdrop-blur-sm rounded-lg">
        <p className="text-white text-center">Loading...</p>
      </div>
    );
  }

  if (attributesIncomplete) {
    return (
      <div className="w-full max-w-2xl mx-auto p-6 bg-black/50 backdrop-blur-sm rounded-lg">
        <p className="text-white text-center">Please complete your attributes first</p>
        <div className="flex justify-center mt-4">
          <Button onClick={onBack}>Go Back</Button>
        </div>
      </div>
    );
  }

  return null;
};