import { CharacterStatus } from "@/types/character";

interface CharacterCreationBackgroundProps {
  currentStep: CharacterStatus;
  children: React.ReactNode;
}

export const CharacterCreationBackground = ({ currentStep, children }: CharacterCreationBackgroundProps) => {
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
        return "https://xbmqwevifguswnqktnnj.supabase.co/storage/v1/object/public/character_creation/Class.webp";
      case "morality":
        return "https://xbmqwevifguswnqktnnj.supabase.co/storage/v1/object/public/character_creation/moral.webp";
      case "attributes":
        return "https://xbmqwevifguswnqktnnj.supabase.co/storage/v1/object/public/character_creation/attributes.webp";
      case "specialty":
        return "https://xbmqwevifguswnqktnnj.supabase.co/storage/v1/object/public/character_creation/attributes.webp";
      case "faith_points":
        return "https://xbmqwevifguswnqktnnj.supabase.co/storage/v1/object/public/character_creation/attributes.webp";
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
    >
      {children}
    </div>
  );
};