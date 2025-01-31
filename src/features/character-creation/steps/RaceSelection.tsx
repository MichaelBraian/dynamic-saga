import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, Text, Flex, RadioGroup, Box, Separator } from '@radix-ui/themes';
import { useCharacterCreation } from '@/store/useCharacterCreation';
import { RaceFormData, RaceWithAnimalTypes, raceSchema } from '@/types/race';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { characterCreationService } from '@/lib/services/characterCreation';

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

  useEffect(() => {
    const fetchRaces = async () => {
      try {
        const data = await characterCreationService.races.list();
        setRaces(data);
      } catch (error) {
        setError('race', 'Failed to load races');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRaces();
  }, [setError]);

  const onRaceChange = (value: string) => {
    setValue('raceId', value);
    updateFormData({ 
      raceId: value,
      // Reset animal type if switching from/to shapeshifter
      animalTypeId: null 
    });
    clearError('race');
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
              <label key={race.id} className="cursor-pointer">
                <Card variant={selectedRaceId === race.id ? 'classic' : 'surface'}>
                  <RadioGroup.Item value={race.id} />
                  <Flex direction="column" gap="2" p="4">
                    <Flex justify="between" align="center">
                      <Text size="3" weight="bold">
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

                    {race.available_animal_types && race.animal_types.length > 0 && (
                      <Box>
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
                              <Flex gap="2" wrap="wrap" mt="1">
                                {animalType.abilities.map((ability) => (
                                  <Text
                                    key={ability}
                                    size="1"
                                    className="px-2 py-1 bg-gray-100/50 rounded-full"
                                  >
                                    {ability}
                                  </Text>
                                ))}
                              </Flex>
                            </Box>
                          ))}
                        </Flex>
                      </Box>
                    )}
                  </Flex>
                </Card>
              </label>
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