import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, Text, Flex, RadioGroup, Box } from '@radix-ui/themes';
import { useCharacterCreation } from '@/store/useCharacterCreation';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { characterCreationService } from '@/lib/services/characterCreation';
import { z } from 'zod';

const genderSchema = z.object({
  gender: z.enum(['male', 'female'], {
    required_error: 'Please select a gender',
    invalid_type_error: 'Gender must be either Male or Female',
  }),
});

type GenderFormData = z.infer<typeof genderSchema>;

type GenderOption = {
  value: 'male' | 'female';
  label: string;
  pronouns: {
    subject: string;
    object: string;
    possessive: string;
  };
};

export function GenderSelection() {
  const { formData, updateFormData, setError, clearError } = useCharacterCreation();
  const [genderOptions, setGenderOptions] = useState<GenderOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<GenderFormData>({
    resolver: zodResolver(genderSchema),
    defaultValues: {
      gender: formData.gender as 'male' | 'female' || '',
    },
  });

  const selectedGender = watch('gender');

  useEffect(() => {
    const fetchGenderOptions = async () => {
      try {
        const data = await characterCreationService.genders.list();
        setGenderOptions(data);
      } catch (error) {
        setError('gender', 'Failed to load gender options');
      } finally {
        setIsLoading(false);
      }
    };

    fetchGenderOptions();
  }, [setError]);

  const onGenderChange = (value: 'male' | 'female') => {
    setValue('gender', value);
    const selectedOption = genderOptions.find(option => option.value === value);
    if (selectedOption) {
      updateFormData({ 
        gender: value, 
        pronouns: `${selectedOption.pronouns.subject}/${selectedOption.pronouns.object}` 
      });
    }
    clearError('gender');
  };

  const onSubmit = (data: GenderFormData) => {
    clearError('gender');
    const selectedOption = genderOptions.find(option => option.value === data.gender);
    if (selectedOption) {
      updateFormData({ 
        ...data, 
        pronouns: `${selectedOption.pronouns.subject}/${selectedOption.pronouns.object}` 
      });
    }
  };

  const onError = () => {
    if (errors.gender) {
      setError('gender', errors.gender.message || 'Invalid gender selection');
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-6">
      <div className="space-y-4">
        <Text as="p" size="2" className="text-gray-500">
          Choose your character's gender. This choice will influence how NPCs interact with your character
          and certain storyline elements.
        </Text>

        <RadioGroup.Root
          value={selectedGender}
          onValueChange={onGenderChange}
        >
          <Flex direction="column" gap="3">
            {genderOptions.map((option) => (
              <label key={option.value} className="cursor-pointer">
                <Card variant={selectedGender === option.value ? 'classic' : 'surface'}>
                  <RadioGroup.Item value={option.value} />
                  <Flex direction="column" gap="2" p="4">
                    <Text size="3" weight="bold">
                      {option.label}
                    </Text>
                    <Text size="2" className="text-gray-500">
                      Pronouns: {option.pronouns.subject}/{option.pronouns.object}
                    </Text>
                  </Flex>
                </Card>
              </label>
            ))}
          </Flex>
        </RadioGroup.Root>

        {errors.gender && (
          <Text color="red" size="2">{errors.gender.message}</Text>
        )}
      </div>
    </form>
  );
} 