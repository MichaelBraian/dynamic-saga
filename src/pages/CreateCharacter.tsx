import { useState } from "react";
import { HamburgerMenu } from "@/components/HamburgerMenu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const CreateCharacter = () => {
  const [characterName, setCharacterName] = useState("");

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url('https://xbmqwevifguswnqktnnj.supabase.co/storage/v1/object/public/character_creation/Name_Character.webp')`
      }}
    >
      <HamburgerMenu />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto bg-white/80 backdrop-blur-sm rounded-lg shadow-md p-6 mt-20">
          <h1 className="text-3xl font-['Cinzel'] text-center mb-8">Name Your Character</h1>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="characterName">Character Name</Label>
              <Input
                id="characterName"
                placeholder="Enter character name"
                value={characterName}
                onChange={(e) => setCharacterName(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCharacter;