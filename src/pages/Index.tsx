import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Swords, ScrollText, Shield, Compass } from "lucide-react";

interface MenuButton {
  icon: React.ReactNode;
  label: string;
  action: () => void;
}

const Index = () => {
  const imageUrl = supabase.storage
    .from('landing')
    .getPublicUrl('Landing_V1.webp').data.publicUrl;

  useEffect(() => {
    console.log("Background image URL:", imageUrl);
  }, [imageUrl]);

  const menuButtons: MenuButton[] = [
    {
      icon: <Swords className="h-5 w-5" />,
      label: "Play",
      action: () => console.log("Play clicked")
    },
    {
      icon: <ScrollText className="h-5 w-5" />,
      label: "Create Character",
      action: () => console.log("Create Character clicked")
    },
    {
      icon: <Shield className="h-5 w-5" />,
      label: "Character List",
      action: () => console.log("Character List clicked")
    },
    {
      icon: <Compass className="h-5 w-5" />,
      label: "Settings",
      action: () => console.log("Settings clicked")
    }
  ];

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
        {menuButtons.map((button, index) => (
          <Button 
            key={index}
            className="flex items-center gap-2 h-12 text-lg font-['IM_Fell_English']"
            variant="outline"
            onClick={button.action}
          >
            {button.icon}
            {button.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default Index;