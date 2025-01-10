import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, Text, Flex, RadioGroup, Box, Separator } from '@radix-ui/themes';
import { useCharacterCreation } from '@/store/useCharacterCreation';
import { ClassFormData, ClassWithSpecialties, classSchema } from '@/types/class';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { characterCreationService } from '@/lib/services/characterCreation';

export function ClassSelection() {
  const { formData, updateFormData, setError, clearError } = useCharacterCreation();
  const [classes, setClasses] = useState<ClassWithSpecialties[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ClassFormData>({
    resolver: zodResolver(classSchema),
    defaultValues: {
      classId: formData.classId || '',
    },
  });

  const selectedClassId = watch('classId');

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const data = await characterCreationService.classes.list();
        setClasses(data);
      } catch (error) {
        setError('class', 'Failed to load character classes');
      } finally {
        setIsLoading(false);
      }
    };

    fetchClasses();
  }, [setError]);

  const onClassChange = (value: string) => {
    setValue('classId', value);
    updateFormData({ classId: value });
    clearError('class');
  };

  const onSubmit = (data: ClassFormData) => {
    clearError('class');
    updateFormData(data);
  };

  const onError = () => {
    if (errors.classId) {
      setError('class', errors.classId.message || 'Invalid class selection');
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-6">
      <div className="space-y-4">
        <Text as="p" size="2" className="text-gray-500">
          Choose your character's class. This choice will determine your combat abilities,
          skills, and role in adventures.
        </Text>

        <RadioGroup.Root
          value={selectedClassId}
          onValueChange={onClassChange}
        >
          <Flex direction="column" gap="3">
            {classes.map((characterClass) => (
              <label key={characterClass.id} className="cursor-pointer">
                <Card variant={selectedClassId === characterClass.id ? 'classic' : 'surface'}>
                  <RadioGroup.Item value={characterClass.id} />
                  <Flex direction="column" gap="2" p="4">
                    <Flex justify="between" align="center">
                      <Text size="3" weight="bold">
                        {characterClass.name}
                      </Text>
                    </Flex>
                    
                    <Text as="p" size="2" className="text-gray-500">
                      {characterClass.overview}
                    </Text>

                    <Separator size="4" />
                    
                    <Box>
                      <Text as="p" size="2" weight="medium">
                        Class Traits:
                      </Text>
                      <Flex gap="2" wrap="wrap" mt="1">
                        {characterClass.traits.map((trait) => (
                          <Text
                            key={trait}
                            size="1"
                            className="px-2 py-1 bg-gray-100 rounded-full"
                          >
                            {trait}
                          </Text>
                        ))}
                      </Flex>
                    </Box>

                    {characterClass.specialties && characterClass.specialties.length > 0 && (
                      <Box>
                        <Text as="p" size="2" weight="medium">
                          Available Specialties:
                        </Text>
                        <Flex direction="column" gap="2" mt="1">
                          {characterClass.specialties.map((specialty) => (
                            <Box
                              key={specialty.id}
                              className="p-2 bg-gray-50 rounded-md"
                            >
                              <Text size="2" weight="medium">
                                {specialty.name}
                              </Text>
                              <Text size="1" className="text-gray-500">
                                {specialty.description}
                              </Text>
                              <Flex gap="2" wrap="wrap" mt="1">
                                {specialty.abilities.map((ability) => (
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

        {errors.classId && (
          <Text color="red" size="2">{errors.classId.message}</Text>
        )}
      </div>
    </form>
  );
} 