import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CharacterSelectionScreen } from "./CharacterSelectionScreen";

interface MoralityQuestionsProps {
  characterId: string;
  onBack: () => void;
}

export const MoralityQuestions = ({ characterId, onBack }: MoralityQuestionsProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [questions, setQuestions] = useState<any[]>([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('category', 'morality');

      if (error) {
        console.error('Error fetching questions:', error);
        toast({
          variant: "destructive",
          description: "Failed to load questions. Please try again.",
        });
        return;
      }

      setQuestions(data);
      setIsLoading(false);
    };

    fetchQuestions();
  }, [toast]);

  const handleOptionSelected = async (answer: string) => {
    try {
      const currentQuestionData = questions[currentQuestion];
      
      // Save the response
      const { error: responseError } = await supabase
        .from('character_responses')
        .insert({
          character_id: characterId,
          question_id: currentQuestionData.id,
          answer: answer
        });

      if (responseError) throw responseError;

      // If there are more questions, move to the next one
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        // Update character status to questioning when all questions are answered
        const { error: statusError } = await supabase
          .from('characters')
          .update({ status: 'questioning' })
          .eq('id', characterId);

        if (statusError) throw statusError;

        navigate("/");
      }
    } catch (error) {
      console.error('Error saving response:', error);
      toast({
        variant: "destructive",
        description: "Failed to save your response. Please try again.",
      });
    }
  };

  if (isLoading) {
    return <div className="text-white">Loading questions...</div>;
  }

  const currentQuestionData = questions[currentQuestion];
  if (!currentQuestionData) return null;

  // Get the scenario text (first line) and options
  const scenarioText = currentQuestionData.question_text.split('\n')[0];
  const options = currentQuestionData.question_text
    .split('\n')
    .slice(1)
    .map(option => option.trim())
    .filter(option => option.match(/^\d\./))
    .map(option => ({
      value: option,
      label: option
    }));

  return (
    <div className="pt-16">
      <CharacterSelectionScreen
        title={`Scenario ${currentQuestion + 1}: ${scenarioText}`}
        options={options}
        characterId={characterId}
        onSelected={handleOptionSelected}
        onBack={currentQuestion === 0 ? onBack : () => setCurrentQuestion(prev => prev - 1)}
        updateField="morality_response"
        nextStatus="questioning"
      />
    </div>
  );
};