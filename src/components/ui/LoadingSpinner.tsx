import { Flex } from '@radix-ui/themes';

export function LoadingSpinner() {
  return (
    <Flex align="center" justify="center" py="4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
    </Flex>
  );
} 