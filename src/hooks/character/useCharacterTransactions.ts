import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CharacterStatus } from "@/types/character";

export const useCharacterTransactions = () => {
  const { toast } = useToast();

  const executeTransaction = async (
    characterId: string,
    operations: (() => Promise<void>)[],
    finalStatus?: CharacterStatus
  ): Promise<boolean> => {
    try {
      for (const operation of operations) {
        await operation();
      }

      if (finalStatus) {
        const { error } = await supabase
          .from('characters')
          .update({ status: finalStatus })
          .eq('id', characterId);

        if (error) throw error;
      }

      return true;
    } catch (error) {
      console.error('Transaction failed:', error);
      toast({
        variant: "destructive",
        description: "Failed to complete operation. Please try again.",
      });
      return false;
    }
  };

  return {
    executeTransaction,
  };
};