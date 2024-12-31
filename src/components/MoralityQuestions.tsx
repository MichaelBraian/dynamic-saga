import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

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

  const handleOptionSelected = async (questionId: string, answer: string) => {
    try {
      // Save the response
      const { error: responseError } = await supabase
        .from('character_responses')
        .insert({
          character_id: characterId,
          question_id: questionId,
          answer: answer
        });

      if (responseError) throw responseError;

      // Move to next question or finish
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        // Update character status to questioning
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
    return <div>Loading questions...</div>;
  }

  const currentQuestionData = questions[currentQuestion];
  if (!currentQuestionData) return null;

  // Parse options from question text
  const options = currentQuestionData.question_text
    .split('\n')
    .slice(1)
    .map((option: string) => option.trim())
    .filter((option: string) => option.match(/^\d\./));

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Scenario {currentQuestion + 1}</h2>
          <p className="text-lg mb-4">{currentQuestionData.question_text.split('\n')[0]}</p>
        </div>
        
        <div className="space-y-4">
          {options.map((option: string, index: number) => (
            <Button
              key={index}
              variant="outline"
              className="w-full text-left justify-start h-auto py-4 px-6"
              onClick={() => handleOptionSelected(currentQuestionData.id, option)}
            >
              {option}
            </Button>
          ))}
        </div>

        {currentQuestion > 0 && (
          <Button
            variant="ghost"
            onClick={onBack}
            className="mt-4"
          >
            Back
          </Button>
        )}
      </Card>
    </div>
  );
};