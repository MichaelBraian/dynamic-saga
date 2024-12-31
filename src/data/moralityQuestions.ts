export const getMoralityQuestionOptions = (questionText: string) => {
  const options = questionText
    .split('\n')
    .slice(1)
    .map(option => option.trim())
    .filter(option => option.match(/^\d\./))
    .map(option => ({
      value: option,
      label: option
    }));

  return options;
};