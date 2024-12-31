import { useState } from "react";
import { HamburgerMenu } from "@/components/HamburgerMenu";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const CreateCharacter = () => {
  const { toast } = useToast();

  const handleCharacterCreation = async () => {
    try {
      // Logic for character creation will go here
      toast({
        title: "Success",
        description: "Character created successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <HamburgerMenu />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-['Cinzel'] text-center mb-8">Create Your Character</h1>
        
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
          <div className="space-y-4">
            <Button onClick={handleCharacterCreation} className="w-full">
              Create Character
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCharacter;
