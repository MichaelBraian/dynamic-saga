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
        <div className="max-w-md mx-auto bg-black/50 backdrop-blur-sm rounded-lg shadow-md p-6 mt-20">
          <h1 className="text-3xl font-['Cinzel'] text-center mb-8 text-white">Name Your Character</h1>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="characterName" className="font-['Cinzel'] text-lg text-white">Character Name</Label>
              <Input
                id="characterName"
                placeholder="Enter character name"
                value={characterName}
                onChange={(e) => setCharacterName(e.target.value)}
                className="font-['Cinzel'] text-lg placeholder:text-gray-400 bg-white/20 text-white border-white/20"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCharacter;