import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, Text, Flex, RadioGroup, Box, Separator } from '@radix-ui/themes';
import { useCharacterCreation } from '@/store/useCharacterCreation';
import { RaceFormData, RaceWithAnimalTypes, raceSchema } from '@/types/race';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export function RaceSelection() {
  const { formData, updateFormData, setError, clearError } = useCharacterCreation();
  const [races, setRaces] = useState<RaceWithAnimalTypes[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RaceFormData>({
    resolver: zodResolver(raceSchema),
    defaultValues: {
      raceId: formData.raceId || '',
    },
  });

  const selectedRaceId = watch('raceId');
  const selectedRace = races.find(race => race.id === selectedRaceId);

  useEffect(() => {
    const fetchRaces = async () => {
      try {
        // In a later phase, this will be replaced with actual API call
        const mockRaces: RaceWithAnimalTypes[] = [
          {
            id: '1',
            name: 'Human',
            description: 'Versatile and ambitious, humans are the most adaptable of all races.',
            abilities: ['Adaptable', 'Skilled', 'Ambitious'],
            available_animal_types: false,
            created_at: null,
            updated_at: null,
            animal_types: [],
          },
          {
            id: '2',
            name: 'Elf',
            description: 'Graceful and long-lived, elves are masters of magic and artistry.',
            abilities: ['Keen Senses', 'Magic Affinity', 'Longevity'],
            available_animal_types: false,
            created_at: null,
            updated_at: null,
            animal_types: [],
          },
          {
            id: '3',
            name: 'Dwarf',
            description: 'Strong and sturdy, dwarves are master craftsmen and warriors.',
            abilities: ['Darkvision', 'Stonecunning', 'Dwarven Resilience'],
            available_animal_types: false,
            created_at: null,
            updated_at: null,
            animal_types: [],
          },
          {
            id: '4',
            name: 'Shapeshifter',
            description: 'Masters of transformation, able to take on animal forms.',
            abilities: ['Shapeshifting', 'Natural Empathy', 'Enhanced Senses'],
            available_animal_types: true,
            created_at: null,
            updated_at: null,
            animal_types: [
              {
                id: '1',
                name: 'Wolf',
                abilities: ['Pack Tactics', 'Keen Hearing and Smell'],
                description: 'Swift and social predator with enhanced senses.',
              },
              {
                id: '2',
                name: 'Bear',
                abilities: ['Powerful Build', 'Natural Weapons'],
                description: 'Strong and resilient with powerful attacks.',
              },
              {
                id: '3',
                name: 'Eagle',
                abilities: ['Flight', 'Keen Eyesight'],
                description: 'Majestic bird with superior vision and flight capabilities.',
              },
            ],
          },
        ];
        setRaces(mockRaces);
      } catch (err) {
        setError('race', 'Failed to load races. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRaces();
  }, [setError]);

  const onRaceChange = (value: string) => {
    setValue('raceId', value);
    const race = races.find(r => r.id === value);
    if (race) {
      updateFormData({ 
        raceId: value,
        // Reset animal type if switching from/to shapeshifter
        animalTypeId: race.available_animal_types ? formData.animalTypeId : null 
      });
      clearError('race');
    }
  };

  const onSubmit = (data: RaceFormData) => {
    clearError('race');
    updateFormData(data);
  };

  const onError = () => {
    if (errors.raceId) {
      setError('race', errors.raceId.message || 'Invalid race selection');
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-6">
      <div className="space-y-4">
        <Text as="p" size="2" className="text-gray-500">
          Choose your character's race. This choice will influence your abilities,
          appearance, and how others interact with you in the world.
        </Text>

        <RadioGroup.Root
          value={selectedRaceId}
          onValueChange={onRaceChange}
        >
          <Flex direction="column" gap="3">
            {races.map((race) => (
              <Card key={race.id} variant="surface">
                <RadioGroup.Item value={race.id} className="sr-only" />
                <Flex direction="column" gap="2" p="4">
                  <Flex justify="between" align="center">
                    <Text as="label" size="3" weight="bold">
                      {race.name}
                    </Text>
                    <Box>
                      {race.available_animal_types && (
                        <Text size="1" className="text-amber-500">
                          Includes Animal Forms
                        </Text>
                      )}
                    </Box>
                  </Flex>
                  
                  <Text as="p" size="2" className="text-gray-500">
                    {race.description}
                  </Text>

                  <Separator size="4" />
                  
                  <Box>
                    <Text as="p" size="2" weight="medium">
                      Racial Abilities:
                    </Text>
                    <Flex gap="2" wrap="wrap" mt="1">
                      {race.abilities.map((ability) => (
                        <Text
                          key={ability}
                          size="1"
                          className="px-2 py-1 bg-gray-100 rounded-full"
                        >
                          {ability}
                        </Text>
                      ))}
                    </Flex>
                  </Box>

                  {race.available_animal_types && selectedRaceId === race.id && (
                    <Box mt="2">
                      <Text as="p" size="2" weight="medium">
                        Available Animal Forms:
                      </Text>
                      <Flex direction="column" gap="2" mt="1">
                        {race.animal_types.map((animalType) => (
                          <Box
                            key={animalType.id}
                            className="p-2 bg-gray-50 rounded-md"
                          >
                            <Text size="2" weight="medium">
                              {animalType.name}
                            </Text>
                            <Text size="1" className="text-gray-500">
                              {animalType.description}
                            </Text>
                          </Box>
                        ))}
                      </Flex>
                    </Box>
                  )}
                </Flex>
              </Card>
            ))}
          </Flex>
        </RadioGroup.Root>

        {errors.raceId && (
          <Text color="red" size="2">{errors.raceId.message}</Text>
        )}
      </div>
    </form>
  );
} 