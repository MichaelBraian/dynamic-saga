import { CharacterStatus } from "@/types/character";
import { contentCache } from "./cacheManager";

interface BackgroundImage {
  mobile: string;
  tablet: string;
  desktop: string;
  alt: string;
}

export const backgroundImages: Partial<Record<CharacterStatus, BackgroundImage>> = {
  naming: {
    mobile: "https://xbmqwevifguswnqktnnj.supabase.co/storage/v1/object/public/character_creation/Name_Character.webp",
    tablet: "https://xbmqwevifguswnqktnnj.supabase.co/storage/v1/object/public/character_creation/Name_Character.webp",
    desktop: "https://xbmqwevifguswnqktnnj.supabase.co/storage/v1/object/public/character_creation/Name_Character.webp",
    alt: "Character naming background"
  },
  gender: {
    mobile: "https://xbmqwevifguswnqktnnj.supabase.co/storage/v1/object/public/character_creation/Choose_Gender.webp",
    tablet: "https://xbmqwevifguswnqktnnj.supabase.co/storage/v1/object/public/character_creation/Choose_Gender.webp",
    desktop: "https://xbmqwevifguswnqktnnj.supabase.co/storage/v1/object/public/character_creation/Choose_Gender.webp",
    alt: "Gender selection background"
  },
  race: {
    mobile: "https://xbmqwevifguswnqktnnj.supabase.co/storage/v1/object/public/character_creation/Race.webp",
    tablet: "https://xbmqwevifguswnqktnnj.supabase.co/storage/v1/object/public/character_creation/Race.webp",
    desktop: "https://xbmqwevifguswnqktnnj.supabase.co/storage/v1/object/public/character_creation/Race.webp",
    alt: "Race selection background"
  },
  animal_type: {
    mobile: "https://xbmqwevifguswnqktnnj.supabase.co/storage/v1/object/public/character_creation/animal.webp",
    tablet: "https://xbmqwevifguswnqktnnj.supabase.co/storage/v1/object/public/character_creation/animal.webp",
    desktop: "https://xbmqwevifguswnqktnnj.supabase.co/storage/v1/object/public/character_creation/animal.webp",
    alt: "Animal type selection background"
  },
  class: {
    mobile: "https://xbmqwevifguswnqktnnj.supabase.co/storage/v1/object/public/character_creation/Class.webp",
    tablet: "https://xbmqwevifguswnqktnnj.supabase.co/storage/v1/object/public/character_creation/Class.webp",
    desktop: "https://xbmqwevifguswnqktnnj.supabase.co/storage/v1/object/public/character_creation/Class.webp",
    alt: "Class selection background"
  },
  attributes: {
    mobile: "https://xbmqwevifguswnqktnnj.supabase.co/storage/v1/object/public/character_creation/attributes.webp",
    tablet: "https://xbmqwevifguswnqktnnj.supabase.co/storage/v1/object/public/character_creation/attributes.webp",
    desktop: "https://xbmqwevifguswnqktnnj.supabase.co/storage/v1/object/public/character_creation/attributes.webp",
    alt: "Attributes selection background"
  },
  clothing: {
    mobile: "https://xbmqwevifguswnqktnnj.supabase.co/storage/v1/object/public/character_creation/Class.webp",
    tablet: "https://xbmqwevifguswnqktnnj.supabase.co/storage/v1/object/public/character_creation/Class.webp",
    desktop: "https://xbmqwevifguswnqktnnj.supabase.co/storage/v1/object/public/character_creation/Class.webp",
    alt: "Clothing selection background"
  },
  morality: {
    mobile: "https://xbmqwevifguswnqktnnj.supabase.co/storage/v1/object/public/character_creation/moral.webp",
    tablet: "https://xbmqwevifguswnqktnnj.supabase.co/storage/v1/object/public/character_creation/moral.webp",
    desktop: "https://xbmqwevifguswnqktnnj.supabase.co/storage/v1/object/public/character_creation/moral.webp",
    alt: "Morality selection background"
  },
  specialty: {
    mobile: "https://xbmqwevifguswnqktnnj.supabase.co/storage/v1/object/public/character_creation/attributes.webp",
    tablet: "https://xbmqwevifguswnqktnnj.supabase.co/storage/v1/object/public/character_creation/attributes.webp",
    desktop: "https://xbmqwevifguswnqktnnj.supabase.co/storage/v1/object/public/character_creation/attributes.webp",
    alt: "Specialty selection background"
  },
  faith_points: {
    mobile: "https://xbmqwevifguswnqktnnj.supabase.co/storage/v1/object/public/character_creation/attributes.webp",
    tablet: "https://xbmqwevifguswnqktnnj.supabase.co/storage/v1/object/public/character_creation/attributes.webp",
    desktop: "https://xbmqwevifguswnqktnnj.supabase.co/storage/v1/object/public/character_creation/attributes.webp",
    alt: "Faith points selection background"
  }
} as const;

export const getDeviceType = (): 'mobile' | 'tablet' | 'desktop' => {
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
};

export const preloadImage = async (url: string): Promise<void> => {
  // Check cache first
  if (contentCache.get('image', url)) {
    return;
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      // Estimate image size (width * height * 4 bytes for RGBA)
      const size = (img.width * img.height * 4);
      contentCache.set('image', url, img, size);
      resolve();
    };
    
    img.onerror = reject;
    img.src = url;
  });
};

export const preloadBackgrounds = async () => {
  const deviceType = getDeviceType();
  const urls = Object.values(backgroundImages).map(img => img[deviceType]);
  await Promise.all(urls.map(preloadImage));
};

export const getBackgroundImage = (step: CharacterStatus): string => {
  const deviceType = getDeviceType();
  return backgroundImages[step]?.[deviceType] || backgroundImages.naming[deviceType];
};

export const getBackgroundAlt = (step: CharacterStatus): string => {
  return backgroundImages[step]?.alt || "Character creation background";
};

// New utility functions for monitoring cache usage
export const getBackgroundCacheStats = () => {
  return contentCache.getStats().image;
};

export const clearBackgroundCache = () => {
  contentCache.clear('image');
}; 