export interface MoralityQuestion {
  id: string;
  question_text: string;
  morality_weight: number;
  category: 'morality' | 'personality' | 'background';
}

export interface MoralityResponse {
  questionId: string;
  answer: string;
}