import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, UserPlus2, Users2 } from "lucide-react";
import { HamburgerMenu } from "@/components/HamburgerMenu";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

interface MenuButton {
  icon: React.ReactNode;
  label: string;
  action: () => void;
  disabled?: boolean;
}

const Index = () => {
  const [hasCharacter, setHasCharacter] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const imageUrl = supabase.storage
    .from('landing')
    .getPublicUrl('Landing_V1.webp').data.publicUrl;

  // Check if user has any characters
  useEffect(() => {
    // TODO: Replace this with actual character check once we implement the characters table
    setHasCharacter(false);
  }, []);

  const handleDisabledClick = () => {
    toast({
      title: "Create a character first",
      description: "You need to create a character before accessing this feature.",
      variant: "destructive",
    });
  };

  const menuButtons: MenuButton[] = [
    {
      icon: <UserPlus2 className="h-5 w-5" />,
      label: "Create Character",
      action: () => navigate('/create-character')
    },
    {
      icon: <Play className="h-5 w-5" />,
      label: "Play",
      action: handleDisabledClick,
      disabled: !hasCharacter
    },
    {
      icon: <Users2 className="h-5 w-5" />,
      label: "Character List",
      action: handleDisabledClick,
      disabled: !hasCharacter
    }
  ];

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center bg-no-repeat bg-gray-100 gap-8"
      style={{ backgroundImage: `url(${imageUrl})` }}
    >
      <HamburgerMenu />
      
      <div className="text-center">
        <h1 className="text-2xl font-medium text-white bg-black/50 px-4 py-2 rounded font-['Cinzel']">
          Welcome To Dynamic Saga
        </h1>
      </div>
      
      <div className="flex flex-col gap-4 w-64 p-4 bg-black/50 rounded-lg">
        {menuButtons.map((button, index) => (
          <Button 
            key={index}
            className={`flex items-center gap-2 h-12 text-lg font-['Cinzel'] ${
              button.disabled ? 'opacity-50' : ''
            }`}
            variant="outline"
            onClick={button.action}
            disabled={button.disabled}
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