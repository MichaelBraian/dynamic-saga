import { ScrollText, Heart, Shield, Swords } from "lucide-react";

interface CharacterInfoSectionProps {
  gender: string;
  race: string;
  class: string;
}

export const CharacterInfoSection = ({
  gender,
  race,
  class: characterClass,
}: CharacterInfoSectionProps) => {
  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <ScrollText className="h-4 w-4 sm:h-5 sm:w-5 text-white/80" />
        <span className="text-sm sm:text-base text-white/80">Character Details</span>
      </div>

      {/* Basic Info Grid */}
      <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 sm:gap-3">
        {/* Combat Stats - Placeholder */}
        <div className="bg-black/20 p-2 sm:p-3 rounded-lg">
          <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
            <Swords className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white/60" />
            <span className="text-xs sm:text-sm text-white/60">Combat</span>
          </div>
          <div className="space-y-0.5 sm:space-y-1">
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-white/40">Attack</span>
              <span className="text-white/80">--</span>
            </div>
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-white/40">Defense</span>
              <span className="text-white/80">--</span>
            </div>
          </div>
        </div>

        {/* Vitality Stats - Placeholder */}
        <div className="bg-black/20 p-2 sm:p-3 rounded-lg">
          <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
            <Heart className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white/60" />
            <span className="text-xs sm:text-sm text-white/60">Vitality</span>
          </div>
          <div className="space-y-0.5 sm:space-y-1">
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-white/40">Health</span>
              <span className="text-white/80">--</span>
            </div>
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-white/40">Stamina</span>
              <span className="text-white/80">--</span>
            </div>
          </div>
        </div>

        {/* Resistances - Placeholder */}
        <div className="bg-black/20 p-2 sm:p-3 rounded-lg">
          <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
            <Shield className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white/60" />
            <span className="text-xs sm:text-sm text-white/60">Resistances</span>
          </div>
          <div className="space-y-0.5 sm:space-y-1">
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-white/40">Magic</span>
              <span className="text-white/80">--</span>
            </div>
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-white/40">Physical</span>
              <span className="text-white/80">--</span>
            </div>
          </div>
        </div>

        {/* Character Info */}
        <div className="bg-black/20 p-2 sm:p-3 rounded-lg">
          <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
            <ScrollText className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white/60" />
            <span className="text-xs sm:text-sm text-white/60">Details</span>
          </div>
          <div className="space-y-0.5 sm:space-y-1">
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-white/40">Gender</span>
              <span className="text-white/80">{gender}</span>
            </div>
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-white/40">Race</span>
              <span className="text-white/80">{race}</span>
            </div>
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-white/40">Class</span>
              <span className="text-white/80">{characterClass}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Future Content Notice */}
      <div className="text-center text-xs sm:text-sm text-white/40 italic">
        More details will be available as your character progresses
      </div>
    </div>
  );
}; 