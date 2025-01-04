import { Package } from "lucide-react";
import { InfoTooltip } from "@/components/shared/InfoTooltip";

interface InventorySectionProps {
  slots?: number;
}

export const InventorySection = ({ slots = 8 }: InventorySectionProps) => {
  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Header with tooltip */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Package className="h-4 w-4 sm:h-5 sm:w-5 text-white/80" />
          <span className="text-sm sm:text-base text-white/80">Equipment</span>
        </div>
        <InfoTooltip content="Your character's inventory slots for equipment and items. More slots will become available as you progress." />
      </div>

      {/* Inventory Grid */}
      <div className="grid grid-cols-4 xs:grid-cols-6 sm:grid-cols-8 gap-1.5 sm:gap-2">
        {[...Array(slots)].map((_, i) => (
          <div
            key={i}
            className="group relative aspect-square bg-black/20 rounded-lg border border-white/10 transition-all hover:border-white/30"
          >
            {/* Empty slot indicator */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Package className="h-4 w-4 sm:h-6 sm:w-6 text-white/20 transition-all group-hover:text-white/40" />
            </div>

            {/* Slot number */}
            <div className="absolute bottom-0.5 right-0.5 sm:bottom-1 sm:right-1 text-[10px] sm:text-xs text-white/40 transition-all group-hover:text-white/60">
              {i + 1}
            </div>

            {/* Hover effect overlay */}
            <div className="absolute inset-0 bg-white/0 transition-all group-hover:bg-white/5 rounded-lg" />
          </div>
        ))}
      </div>

      {/* Inventory Status */}
      <div className="text-center text-xs sm:text-sm text-white/60">
        <span className="text-white/40">0</span> / {slots} slots used
      </div>
    </div>
  );
}; 