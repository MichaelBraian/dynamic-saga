import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { ProfileSection } from './character-card/ProfileSection';
import { AttributesSection } from './character-card/AttributesSection';
import { MoralitySection } from './character-card/MoralitySection';
import { FaithPointsSection } from './character-card/FaithPointsSection';
import { SpecialtySection } from './character-card/SpecialtySection';
import { InventorySection } from './character-card/InventorySection';
import { CharacterInfoSection } from './character-card/CharacterInfoSection';

interface CharacterCardStepProps {
  characterId: string;
}

interface CharacterData {
  id: string;
  name: string;
  race: string;
  class: string;
  gender: string;
}

interface CharacterAttribute {
  attribute_name: string;
  base_value: number;
  modifier: number;
  value: number;
}

interface CharacterMorality {
  alignment_score: number;
  good_evil_scale: number;
  lawful_chaotic_scale: number;
}

interface CharacterSpecialty {
  specialty_id: string;
  specialty: {
    name: string;
    description: string;
    attribute_modifiers: Record<string, number>;
  };
}

export const CharacterCardStep = ({ characterId }: CharacterCardStepProps) => {
  const { toast } = useToast();

  // Fetch basic character data
  const { data: characterData, isLoading: loadingCharacter } = useQuery({
    queryKey: ['character', characterId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('characters')
        .select('id, name, race, class, gender')
        .eq('id', characterId)
        .single();

      if (error) {
        toast({
          title: 'Error',
          description: 'Failed to load character data',
          variant: 'destructive',
        });
        throw error;
      }

      return data as CharacterData;
    },
  });

  // Fetch character attributes
  const { data: attributes, isLoading: loadingAttributes } = useQuery({
    queryKey: ['character-attributes', characterId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('character_attributes')
        .select('attribute_name, base_value, modifier, value')
        .eq('character_id', characterId);

      if (error) {
        toast({
          title: 'Error',
          description: 'Failed to load character attributes',
          variant: 'destructive',
        });
        throw error;
      }

      return data as CharacterAttribute[];
    },
  });

  // Fetch character morality
  const { data: morality, isLoading: loadingMorality } = useQuery({
    queryKey: ['character-morality', characterId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('character_morality')
        .select('alignment_score, good_evil_scale, lawful_chaotic_scale')
        .eq('character_id', characterId)
        .single();

      if (error) {
        toast({
          title: 'Error',
          description: 'Failed to load character morality',
          variant: 'destructive',
        });
        throw error;
      }

      return data as CharacterMorality;
    },
  });

  // Fetch faith points
  const { data: faithPoints, isLoading: loadingFaith } = useQuery({
    queryKey: ['faith-points', characterId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('character_faith_points')
        .select('faith_points')
        .eq('character_id', characterId)
        .single();

      if (error) {
        toast({
          title: 'Error',
          description: 'Failed to load faith points',
          variant: 'destructive',
        });
        throw error;
      }

      return data.faith_points as number;
    },
  });

  // Fetch specialty
  const { data: specialty, isLoading: loadingSpecialty } = useQuery({
    queryKey: ['character-specialty', characterId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('character_specialties')
        .select(`
          specialty_id,
          specialty:specialties!inner (
            name,
            description,
            attribute_modifiers
          )
        `)
        .eq('character_id', characterId)
        .single();

      if (error) {
        toast({
          title: 'Error',
          description: 'Failed to load character specialty',
          variant: 'destructive',
        });
        throw error;
      }

      return data as unknown as CharacterSpecialty;
    },
  });

  const isLoading = loadingCharacter || loadingAttributes || loadingMorality || loadingFaith || loadingSpecialty;

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex flex-col overflow-y-auto bg-black/40">
      <div className="min-h-full w-full max-w-4xl mx-auto p-4 py-6 sm:py-8">
        <div className="bg-black/60 backdrop-blur-md rounded-lg p-4 sm:p-6">
          {/* Basic grid layout for sections */}
          <div className="grid grid-cols-1 gap-4 sm:gap-6">
            {/* Profile Section - Always First */}
            <div className="bg-black/30 rounded-lg p-3 sm:p-4">
              <h2 className="text-lg sm:text-xl text-white mb-3 sm:mb-4">Profile</h2>
              {characterData && (
                <ProfileSection
                  name={characterData.name}
                  race={characterData.race}
                  class={characterData.class}
                />
              )}
            </div>

            {/* Attributes Section */}
            <div className="bg-black/30 rounded-lg p-3 sm:p-4">
              <h2 className="text-lg sm:text-xl text-white mb-3 sm:mb-4">Attributes</h2>
              {attributes && <AttributesSection attributes={attributes} />}
            </div>

            {/* Desktop Layout Wrapper - Hidden on Mobile */}
            <div className="hidden sm:grid sm:grid-cols-2 gap-4 sm:gap-6">
              {/* Specialty Section */}
              <div className="bg-black/30 rounded-lg p-3 sm:p-4">
                <h2 className="text-lg sm:text-xl text-white mb-3 sm:mb-4">Specialty</h2>
                {specialty && (
                  <SpecialtySection
                    name={specialty.specialty.name}
                    description={specialty.specialty.description}
                    attributeModifiers={specialty.specialty.attribute_modifiers}
                  />
                )}
              </div>

              {/* Faith Points Section */}
              <div className="bg-black/30 rounded-lg p-3 sm:p-4">
                <h2 className="text-lg sm:text-xl text-white mb-3 sm:mb-4">Divine Power</h2>
                {faithPoints !== undefined && (
                  <FaithPointsSection faithPoints={faithPoints} />
                )}
              </div>
            </div>

            {/* Mobile Only Sections - Hidden on Desktop */}
            <div className="sm:hidden space-y-4">
              {/* Specialty Section - Mobile */}
              <div className="bg-black/30 rounded-lg p-3">
                <h2 className="text-lg text-white mb-3">Specialty</h2>
                {specialty && (
                  <SpecialtySection
                    name={specialty.specialty.name}
                    description={specialty.specialty.description}
                    attributeModifiers={specialty.specialty.attribute_modifiers}
                  />
                )}
              </div>

              {/* Faith Points Section - Mobile */}
              <div className="bg-black/30 rounded-lg p-3">
                <h2 className="text-lg text-white mb-3">Divine Power</h2>
                {faithPoints !== undefined && (
                  <FaithPointsSection faithPoints={faithPoints} />
                )}
              </div>

              {/* Character Info Section - Mobile */}
              <div className="bg-black/30 rounded-lg p-3">
                <h2 className="text-lg text-white mb-3">Character Details</h2>
                {characterData && (
                  <CharacterInfoSection
                    gender={characterData.gender}
                    race={characterData.race}
                    class={characterData.class}
                  />
                )}
              </div>

              {/* Morality Section - Mobile */}
              <div className="bg-black/30 rounded-lg p-3">
                <h2 className="text-lg text-white mb-3">Morality</h2>
                {morality && (
                  <MoralitySection
                    alignmentScore={morality.alignment_score}
                    goodEvilScale={morality.good_evil_scale}
                    lawfulChaoticScale={morality.lawful_chaotic_scale}
                  />
                )}
              </div>
            </div>

            {/* Desktop Layout Wrapper - Hidden on Mobile */}
            <div className="hidden sm:grid sm:grid-cols-2 gap-4 sm:gap-6">
              {/* Character Info Section */}
              <div className="bg-black/30 rounded-lg p-3 sm:p-4">
                <h2 className="text-lg sm:text-xl text-white mb-3 sm:mb-4">Character Details</h2>
                {characterData && (
                  <CharacterInfoSection
                    gender={characterData.gender}
                    race={characterData.race}
                    class={characterData.class}
                  />
                )}
              </div>

              {/* Morality Section */}
              <div className="bg-black/30 rounded-lg p-3 sm:p-4">
                <h2 className="text-lg sm:text-xl text-white mb-3 sm:mb-4">Morality</h2>
                {morality && (
                  <MoralitySection
                    alignmentScore={morality.alignment_score}
                    goodEvilScale={morality.good_evil_scale}
                    lawfulChaoticScale={morality.lawful_chaotic_scale}
                  />
                )}
              </div>
            </div>

            {/* Inventory Section - Full width */}
            <div className="bg-black/30 rounded-lg p-3 sm:p-4">
              <h2 className="text-lg sm:text-xl text-white mb-3 sm:mb-4">Equipment</h2>
              <InventorySection slots={8} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 