interface CharacterBackgroundProps {
  currentStep: string;
}

export const CharacterBackground = ({ currentStep }: CharacterBackgroundProps) => {
  const getBackgroundImage = () => {
    switch (currentStep) {
      case "naming":
        return "https://xbmqwevifguswnqktnnj.supabase.co/storage/v1/object/public/character_creation/Name_Character.webp";
      case "gender":
        return "https://xbmqwevifguswnqktnnj.supabase.co/storage/v1/object/public/character_creation/Choose_Gender.webp";
      case "race":
        return "https://xbmqwevifguswnqktnnj.supabase.co/storage/v1/object/public/character_creation/Race.webp";
      case "animal_type":
        return "https://xbmqwevifguswnqktnnj.supabase.co/storage/v1/object/public/character_creation/animal.webp";
      case "class":
        return "https://xbmqwevifguswnqktnnj.supabase.co/storage/v1/object/public/character_creation/Class.webp";
      case "clothing":
      case "armor":
      case "morality":
        return "https://xbmqwevifguswnqktnnj.supabase.co/storage/v1/object/public/character_creation/Class.webp";
      default:
        return "https://xbmqwevifguswnqktnnj.supabase.co/storage/v1/object/public/character_creation/Name_Character.webp";
    }
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat transition-all duration-500"
      style={{
        backgroundImage: `url('${getBackgroundImage()}')`
      }}
    />
  );
};