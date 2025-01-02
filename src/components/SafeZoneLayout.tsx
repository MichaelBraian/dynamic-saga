import { HamburgerMenu } from "./HamburgerMenu";

interface SafeZoneLayoutProps {
  children: React.ReactNode;
}

export const SafeZoneLayout = ({ children }: SafeZoneLayoutProps) => {
  return (
    <div className="relative min-h-screen">
      {/* Fixed header area for hamburger menu with gradient background */}
      <div className="fixed top-0 left-0 w-full h-16 z-50">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent pointer-events-none" />
        
        {/* Menu container with proper spacing */}
        <div className="relative px-4 py-2">
          <div className="pointer-events-auto w-fit">
            <HamburgerMenu />
          </div>
        </div>
      </div>
      
      {/* Main content with safe zone padding */}
      <div className="pt-16 min-h-screen">
        {children}
      </div>
    </div>
  );
}; 