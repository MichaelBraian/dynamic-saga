import { User } from "lucide-react";

interface ProfileSectionProps {
  name: string;
  race: string;
  class: string;
}

export const ProfileSection = ({ name, race, class: characterClass }: ProfileSectionProps) => {
  return (
    <div className="flex flex-col items-center">
      {/* Profile Image Placeholder */}
      <div className="w-32 h-32 bg-black/40 rounded-lg mb-4 flex items-center justify-center">
        <User className="w-16 h-16 text-white/40" />
      </div>

      {/* Character Name */}
      <h1 className="text-2xl font-['Cinzel'] text-white mb-2">{name}</h1>

      {/* Race and Class */}
      <div className="text-lg text-white/80">
        {race} - {characterClass}
      </div>
    </div>
  );
}; 