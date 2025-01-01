import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { attributes } from "../attributes/attributeDefinitions";

interface ModifiedAttributesDisplayProps {
  originalAttributes: Record<string, number>;
  modifiedAttributes: Record<string, number>;
  onBack: () => void;
  onContinue: () => void;
}

export const ModifiedAttributesDisplay = ({
  originalAttributes,
  modifiedAttributes,
  onBack,
  onContinue,
}: ModifiedAttributesDisplayProps) => {
  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between mb-8">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="text-white hover:bg-white/20"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-3xl font-['Cinzel'] text-center flex-1 text-white">
          Modified Attributes
        </h1>
        <div className="w-10" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {attributes.map((attr) => {
          const originalValue = originalAttributes[attr.name] || 0;
          const modifiedValue = modifiedAttributes[attr.name] || 0;
          const isIncreased = modifiedValue > originalValue;
          const isDecreased = modifiedValue < originalValue;
          const difference = modifiedValue - originalValue;

          return (
            <div
              key={attr.name}
              className="flex items-center justify-between p-4 bg-black/30 rounded-lg"
            >
              <div className="flex items-center gap-4">
                <attr.icon className="h-6 w-6 text-white/80" />
                <div>
                  <h3 className="text-lg font-['Cinzel'] text-white">{attr.label}</h3>
                  <div className="flex items-center gap-6">
                    <span className="text-2xl font-bold text-white">
                      {originalValue}
                    </span>
                    <span className="text-white/50">→</span>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-2xl font-bold ${
                          isIncreased
                            ? "text-emerald-400"
                            : isDecreased
                            ? "text-rose-400"
                            : "text-white"
                        }`}
                      >
                        {modifiedValue}
                      </span>
                      {difference !== 0 && (
                        <span
                          className={`text-sm ${
                            isIncreased ? "text-emerald-400" : "text-rose-400"
                          }`}
                        >
                          ({difference > 0 ? "+" : ""}{difference})
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-center mt-8">
        <Button
          onClick={onContinue}
          className="bg-white/10 text-white hover:bg-white/20"
        >
          Continue <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}; 