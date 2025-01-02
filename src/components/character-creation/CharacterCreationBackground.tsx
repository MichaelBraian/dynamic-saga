import { useEffect, useState, useCallback } from "react";
import { CharacterStatus } from "@/types/character";
import { getBackgroundImage, getBackgroundAlt, preloadBackgrounds, getDeviceType } from "@/lib/backgroundManager";

interface CharacterCreationBackgroundProps {
  currentStep: CharacterStatus;
  children: React.ReactNode;
}

export const CharacterCreationBackground = ({ currentStep, children }: CharacterCreationBackgroundProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentBgUrl, setCurrentBgUrl] = useState<string>("");
  const [deviceType, setDeviceType] = useState(getDeviceType());

  const updateBackground = useCallback(() => {
    setCurrentBgUrl(getBackgroundImage(currentStep));
  }, [currentStep]);

  // Handle window resize
  useEffect(() => {
    let resizeTimer: NodeJS.Timeout;

    const handleResize = () => {
      // Debounce resize event
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const newDeviceType = getDeviceType();
        if (newDeviceType !== deviceType) {
          setDeviceType(newDeviceType);
          updateBackground();
        }
      }, 250); // Wait for 250ms after resize ends
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimer);
    };
  }, [deviceType, updateBackground]);

  // Initial background loading
  useEffect(() => {
    const initializeBackgrounds = async () => {
      try {
        await preloadBackgrounds();
        updateBackground();
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to preload backgrounds:", error);
        setIsLoading(false);
      }
    };

    initializeBackgrounds();
  }, [updateBackground]);

  // Update background when step changes
  useEffect(() => {
    updateBackground();
  }, [currentStep, updateBackground]);

  return (
    <div className="relative min-h-screen">
      {/* Loading state */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
          <div className="text-white text-xl">Loading...</div>
        </div>
      )}

      {/* Background layer */}
      <div 
        role="img"
        aria-label={getBackgroundAlt(currentStep)}
        className="fixed inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-500 -z-10"
        style={{
          backgroundImage: `url('${currentBgUrl}')`,
          opacity: isLoading ? 0 : 1
        }}
      />
      
      {/* Gradient overlay */}
      <div className="fixed top-0 left-0 w-full h-24 bg-gradient-to-b from-black/40 to-transparent pointer-events-none" />
      
      {/* Content */}
      <div className="pt-16">
        {children}
      </div>
    </div>
  );
};