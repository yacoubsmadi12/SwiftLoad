import { cn } from "@/lib/utils";

interface AdSlotProps {
  type: "top-banner" | "sidebar" | "below-download";
  className?: string;
}

export function AdSlot({ type, className }: AdSlotProps) {
  return (
    <div 
      className={cn(
        "ad-slot w-full",
        {
          "ad-slot-top-banner": type === "top-banner",
          "ad-slot-sidebar": type === "sidebar",
          "ad-slot-below-download": type === "below-download",
        },
        className
      )}
      data-testid={`ad-slot-${type}`}
    />
  );
}
