import { useState, useCallback } from 'react';

interface MoralityNavigation {
  currentIndex: number;
  canGoBack: boolean;
  canGoForward: boolean;
  goBack: () => void;
  goForward: () => void;
  goToQuestion: (index: number) => void;
}

export const useMoralityNavigation = (totalQuestions: number): MoralityNavigation => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const goBack = useCallback(() => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
  }, []);

  const goForward = useCallback(() => {
    setCurrentIndex(prev => Math.min(totalQuestions - 1, prev + 1));
  }, [totalQuestions]);

  const goToQuestion = useCallback((index: number) => {
    if (index >= 0 && index < totalQuestions) {
      setCurrentIndex(index);
    }
  }, [totalQuestions]);

  return {
    currentIndex,
    canGoBack: currentIndex > 0,
    canGoForward: currentIndex < totalQuestions - 1,
    goBack,
    goForward,
    goToQuestion
  };
}; 