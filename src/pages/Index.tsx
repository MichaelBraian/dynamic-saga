import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

const Index = () => {
  const imageUrl = supabase.storage
    .from('landing')
    .getPublicUrl('landing_V1.webp').data.publicUrl;

  useEffect(() => {
    console.log("Background image URL:", imageUrl);
  }, [imageUrl]);

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat bg-gray-100"
      style={{ backgroundImage: `url(${imageUrl})` }}
    >
      <div className="text-center">
        <h1 className="text-2xl font-medium text-white bg-black/50 px-4 py-2 rounded">Welcome</h1>
      </div>
    </div>
  );
};

export default Index;