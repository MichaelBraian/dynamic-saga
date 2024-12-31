import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { HamburgerMenu } from "./HamburgerMenu";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  const { session } = useAuth();

  if (!session) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="relative">
      <HamburgerMenu />
      {children}
    </div>
  );
};