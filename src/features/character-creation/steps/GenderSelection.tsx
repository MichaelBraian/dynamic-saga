import { useForm } from 'react-hook-form';
import { TextField, RadioGroup, Text, Flex } from '@radix-ui/themes';
import { useCharacterCreation } from '@/store/useCharacterCreation';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const genderSchema = z.object({
  gender: z.enum(['male', 'female'], {
    required_error: 'Please select a gender',
    invalid_type_error: 'Gender must be either Male or Female',
  }),
  pronouns: z.string().min(1, 'Please specify pronouns'),
});

type GenderFormData = z.infer<typeof genderSchema>;

const genderOptions = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
] as const;

const defaultPronouns = {
  male: 'he/him',
  female: 'she/her',
};

export function GenderSelection() {
  const { formData, updateFormData, setError, clearError } = useCharacterCreation();
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<GenderFormData>({
    resolver: zodResolver(genderSchema),
    defaultValues: {
      gender: formData.gender as 'male' | 'female' || '',
      pronouns: formData.pronouns || '',
    },
  });

  const selectedGender = watch('gender');

  const onGenderChange = (value: 'male' | 'female') => {
    setValue('gender', value);
    setValue('pronouns', defaultPronouns[value]);
  };

  const onSubmit = (data: GenderFormData) => {
    clearError('gender');
    clearError('pronouns');
    updateFormData(data);
  };

  const onError = () => {
    if (errors.gender) {
      setError('gender', errors.gender.message || 'Invalid gender selection');
    }
    if (errors.pronouns) {
      setError('pronouns', errors.pronouns.message || 'Invalid pronouns');
    }
  };

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
          <Flex direction="column" gap="2">
            {genderOptions.map((option) => (
              <Text as="label" key={option.value} size="2">
                <Flex gap="2" align="center">
                  <RadioGroup.Item value={option.value} />
                  {option.label}
                </Flex>
              </Text>
            ))}
          </Flex>
        </RadioGroup.Root>
        
        {errors.gender && (
          <Text color="red" size="2">{errors.gender.message}</Text>
        )}
      </div>

      <div className="space-y-2">
        <Text as="label" size="2" weight="medium">
          Pronouns
        </Text>
        <TextField.Root>
          <TextField.Input
            placeholder="e.g., he/him, she/her"
            {...register('pronouns')}
            readOnly
          />
        </TextField.Root>
        {errors.pronouns && (
          <Text color="red" size="2">{errors.pronouns.message}</Text>
        )}
        <Text as="p" size="2" className="text-gray-500">
          Pronouns are automatically set based on your character's gender.
        </Text>
      </div>
    </form>
  );
} 