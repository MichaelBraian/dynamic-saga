import { useState } from "react";
import { HamburgerMenu } from "@/components/HamburgerMenu";
import { Input } from "@/components/ui/input";

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
      <div className="container mx-auto px-4 min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full bg-black/50 backdrop-blur-sm rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-['Cinzel'] text-center mb-8 text-white">Name Your Character</h1>
          <Input
            placeholder="Enter character name"
            value={characterName}
            onChange={(e) => setCharacterName(e.target.value)}
            className="font-['Cinzel'] text-lg placeholder:text-gray-400 bg-white/20 text-white border-white/20"
          />
        </div>
      </div>
    </div>
  );
};

export default CreateCharacter;