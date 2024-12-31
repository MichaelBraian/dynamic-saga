import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const imageUrl = supabase.storage
    .from('landing')
    .getPublicUrl('landing_V1.webp').data.publicUrl;

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${imageUrl})` }}
    >
      <div className="text-center">
        <h1 className="text-2xl font-medium text-white">Welcome</h1>
      </div>
    </div>
  );
};

export default Index;