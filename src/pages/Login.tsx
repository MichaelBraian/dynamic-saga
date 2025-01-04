import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          navigate("/");
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  const imageUrl = supabase.storage
    .from('landing')
    .getPublicUrl('Landing_V1.webp').data.publicUrl;

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${imageUrl})` }}
    >
      <div className="w-full max-w-md p-6 bg-black/50 backdrop-blur-sm rounded-lg shadow-lg">
        <div className="mb-6">
          <h1 className="text-3xl font-['Cinzel'] text-center text-white">
            Welcome to DynamicSaga
          </h1>
          <p className="mt-2 text-center text-sm text-white/80">
            Begin your adventure
          </p>
        </div>
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: 'rgb(255 255 255 / 0.2)',
                  brandAccent: 'rgb(255 255 255 / 0.3)',
                  brandButtonText: "white",
                  defaultButtonBackground: "rgb(255 255 255 / 0.1)",
                  defaultButtonBackgroundHover: "rgb(255 255 255 / 0.2)",
                  defaultButtonBorder: "rgb(255 255 255 / 0.1)",
                  defaultButtonText: "white",
                  dividerBackground: "rgb(255 255 255 / 0.2)",
                  inputBackground: "rgb(255 255 255 / 0.1)",
                  inputBorder: "rgb(255 255 255 / 0.1)",
                  inputText: "white",
                  inputPlaceholder: "rgb(255 255 255 / 0.5)",
                }
              }
            },
            className: {
              container: 'w-full',
              button: 'w-full font-["Cinzel"]',
              input: 'rounded-md font-["Cinzel"]',
              label: 'font-["Cinzel"] text-white',
              anchor: 'text-white/80 hover:text-white',
            }
          }}
          theme="dark"
          providers={[]}
        />
      </div>
    </div>
  );
};

export default Login;