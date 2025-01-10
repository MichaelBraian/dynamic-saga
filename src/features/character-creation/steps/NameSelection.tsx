import { useForm } from 'react-hook-form';
import { TextField } from '@radix-ui/themes';
import { useCharacterCreation } from '@/store/useCharacterCreation';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const nameSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes'),
});

type NameFormData = z.infer<typeof nameSchema>;

export function NameSelection() {
  const { formData, updateFormData, setError, clearError } = useCharacterCreation();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NameFormData>({
    resolver: zodResolver(nameSchema),
    defaultValues: {
      name: formData.name || '',
    },
  });

  const onSubmit = (data: NameFormData) => {
    clearError('name');
    updateFormData(data);
  };

  const onError = () => {
    if (errors.name) {
      setError('name', errors.name.message || 'Invalid name');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Character Name
        </label>
        <TextField.Root>
          <TextField.Input
            id="name"
            placeholder="Enter character name"
            {...register('name')}
          />
        </TextField.Root>
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>
      
      <div className="text-sm text-gray-500">
        <h3 className="font-medium mb-2">Name Guidelines:</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>Must be between 2 and 50 characters</li>
          <li>Can contain letters, spaces, hyphens, and apostrophes</li>
          <li>Should reflect your character's identity and background</li>
        </ul>
      </div>
    </form>
  );
} 