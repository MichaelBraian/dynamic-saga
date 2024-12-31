import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { GameController, UserPlus, Users, Settings } from "lucide-react";

const Index = () => {
  const imageUrl = supabase.storage
    .from('landing')
    .getPublicUrl('Landing_V1.webp').data.publicUrl;

  useEffect(() => {
    console.log("Background image URL:", imageUrl);
  }, [imageUrl]);

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center bg-no-repeat bg-gray-100 gap-8"
      style={{ backgroundImage: `url(${imageUrl})` }}
    >
      <div className="text-center">
        <h1 className="text-2xl font-medium text-white bg-black/50 px-4 py-2 rounded font-['IM_Fell_English']">
          Welcome To Dynamic Saga
        </h1>
      </div>
      
      <div className="flex flex-col gap-4 w-64 p-4 bg-black/50 rounded-lg">
        <Button 
          className="flex items-center gap-2 h-12 text-lg font-['IM_Fell_English']"
          variant="outline"
        >
          <GameController className="h-5 w-5" />
          Play
        </Button>
        
        <Button 
          className="flex items-center gap-2 h-12 text-lg font-['IM_Fell_English']"
          variant="outline"
        >
          <UserPlus className="h-5 w-5" />
          Create Character
        </Button>
        
        <Button 
          className="flex items-center gap-2 h-12 text-lg font-['IM_Fell_English']"
          variant="outline"
        >
          <Users className="h-5 w-5" />
          Character List
        </Button>
        
        <Button 
          className="flex items-center gap-2 h-12 text-lg font-['IM_Fell_English']"
          variant="outline"
        >
          <Settings className="h-5 w-5" />
          Settings
        </Button>
      </div>
    </div>
  );
};

export default Index;