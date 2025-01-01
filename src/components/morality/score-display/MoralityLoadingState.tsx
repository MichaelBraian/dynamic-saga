interface MoralityLoadingStateProps {
  message: string;
}

export const MoralityLoadingState = ({ message }: MoralityLoadingStateProps) => {
  return (
    <div className="w-full max-w-md mx-auto p-6 bg-black/50 backdrop-blur-sm rounded-lg">
      <h2 className="text-2xl font-['IM_Fell_English'] text-white text-center mb-6">{message}</h2>
    </div>
  );
};