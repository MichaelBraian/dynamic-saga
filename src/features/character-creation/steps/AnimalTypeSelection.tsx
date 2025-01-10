import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, Text, Flex, RadioGroup, Box } from '@radix-ui/themes';
import { useCharacterCreation } from '@/store/useCharacterCreation';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { characterCreationService } from '@/lib/services/characterCreation';
import { z } from 'zod';

const animalTypeSchema = z.object({
  animalTypeId: z.string({
    required_error: 'Please select an animal form',
    invalid_type_error: 'Invalid animal form selection',
  }),
});

type AnimalTypeFormData = z.infer<typeof animalTypeSchema>;

type AnimalType = {
  id: string;
  name: string;
  abilities: string[];
  description: string;
};

export function AnimalTypeSelection() {
  const { formData, updateFormData, setError, clearError } = useCharacterCreation();
  const [animalTypes, setAnimalTypes] = useState<AnimalType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AnimalTypeFormData>({
    resolver: zodResolver(animalTypeSchema),
    defaultValues: {
      animalTypeId: formData.animalTypeId || '',
    },
  });

  const selectedAnimalTypeId = watch('animalTypeId');

  useEffect(() => {
    const fetchAnimalTypes = async () => {
      try {
        const races = await characterCreationService.races.list();
        const shapeshifterRace = races.find(race => race.id === formData.raceId);
        if (shapeshifterRace && shapeshifterRace.animal_types) {
          setAnimalTypes(shapeshifterRace.animal_types);
        }
      } catch (error) {
        setError('animalType', 'Failed to load animal forms');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnimalTypes();
  }, [formData.raceId, setError]);

  const onAnimalTypeChange = (value: string) => {
    setValue('animalTypeId', value);
    updateFormData({ animalTypeId: value });
    clearError('animalType');
  };

  const onSubmit = (data: AnimalTypeFormData) => {
    clearError('animalType');
    updateFormData(data);
  };

  const onError = () => {
    if (errors.animalTypeId) {
      setError('animalType', errors.animalTypeId.message || 'Invalid animal form selection');
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-6">
      <div className="space-y-4">
        <Text as="p" size="2" className="text-gray-500">
          As a Shapeshifter, you can transform into different animal forms. Choose your primary
          animal form, which you'll use most frequently in your adventures.
        </Text>

        <RadioGroup.Root
          value={selectedAnimalTypeId}
          onValueChange={onAnimalTypeChange}
        >
          <Flex direction="column" gap="3">
            {animalTypes.map((animalType) => (
              <label key={animalType.id} className="cursor-pointer">
                <Card variant={selectedAnimalTypeId === animalType.id ? 'classic' : 'surface'}>
                  <RadioGroup.Item value={animalType.id} />
                  <Flex direction="column" gap="2" p="4">
                    <Text size="3" weight="bold">
                      {animalType.name}
                    </Text>
                    
                    <Text as="p" size="2" className="text-gray-500">
                      {animalType.description}
                    </Text>

                    <Box>
                      <Text as="p" size="2" weight="medium">
                        Form Abilities:
                      </Text>
                      <Flex gap="2" wrap="wrap" mt="1">
                        {animalType.abilities.map((ability) => (
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
                  </Flex>
                </Card>
              </label>
            ))}
          </Flex>
        </RadioGroup.Root>

        {errors.animalTypeId && (
          <Text color="red" size="2">{errors.animalTypeId.message}</Text>
        )}
      </div>
    </form>
  );
} 