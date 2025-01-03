import { Card } from "@/components/ui/card";
import { SelectionOptions } from "../character-selection/SelectionOptions";
import { SelectionHeader } from "../character-selection/SelectionHeader";
import { Database } from "@/integrations/supabase/types";
import { useState, useEffect } from "react";

type Question = Database['public']['Tables']['questions']['Row'];
type Response = Database['public']['Tables']['character_responses']['Row'];

interface MoralityQuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  onAnswerSelected: (answer: string) => void;
  onBack: () => void;
  characterId: string;
  previousResponses?: Response[];
}

export const MoralityQuestionCard = ({
  question,
  questionNumber,
  totalQuestions,
  onAnswerSelected,
  onBack,
  characterId,
  previousResponses = [],
}: MoralityQuestionCardProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Find previous answer for this question
  const previousAnswer = previousResponses.find(
    response => response.question_id === question.id
  )?.answer || null;

  // Parse the question text to get the scenario and options
  const [scenario, ...optionTexts] = question.question_text.split('\n');
  
  // Create options array with clean labels and formatted values
  const options = optionTexts
    .map(option => option.trim())
    .filter(option => option.length > 0)
    .map((option, index) => {
      // Remove any existing number prefix from the option
      const cleanOption = option.replace(/^\d+\.\s*/, '').trim();
      return {
        value: `${index + 1}. ${cleanOption}`,
        label: cleanOption
      };
    });

  const handleAnswerSelected = async (selectedOption: string) => {
    setIsSubmitting(true);
    try {
      console.log('Selected option:', selectedOption);
      console.log('Available options:', options);

      // Clean the selected option by removing any number prefix
      const cleanSelectedOption = selectedOption.replace(/^\d+\.\s*/, '').trim();
      console.log('Clean selected option:', cleanSelectedOption);

      // Find the selected option by comparing with clean labels
      const index = options.findIndex(opt => opt.label === cleanSelectedOption);
      if (index === -1) {
        console.error('Selected option not found:', cleanSelectedOption);
        return;
      }
      
      // Format answer as "1. Answer text"
      const answer = options[index].value;
      console.log('Formatted answer:', answer);

      await onAnswerSelected(answer);
    } catch (error) {
      console.error('Error in handleAnswerSelected:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md w-full bg-black/50 backdrop-blur-sm rounded-lg shadow-md p-6">
      <SelectionHeader 
        title={`Question ${questionNumber} of ${totalQuestions}`}
        onBack={onBack}
        showBackButton={true}
      />
      <div className="mt-4 mb-6">
        <p className="text-white font-['IM_Fell_English'] text-lg">
          {scenario}
        </p>
      </div>
      <SelectionOptions 
        options={options}
        onValueChange={handleAnswerSelected}
        isDisabled={isSubmitting}
        initialValue={previousAnswer}
      />
    </div>
  );
};