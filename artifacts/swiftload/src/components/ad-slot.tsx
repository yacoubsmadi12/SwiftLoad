import { cn } from "@/lib/utils";

interface AdSlotProps {
  type: "top-banner" | "sidebar" | "below-download" | "left-sidebar" | "right-sidebar" | "footer-banner";
  className?: string;
}

export function AdSlot({ type, className }: AdSlotProps) {
  return (
    <div
      className={cn(
        "ad-slot",
        {
          "ad-slot-top-banner": type === "top-banner",
          "ad-slot-sidebar": type === "sidebar",
          "ad-slot-below-download": type === "below-download",
          "ad-slot-left-sidebar": type === "left-sidebar",
          "ad-slot-right-sidebar": type === "right-sidebar",
          "ad-slot-footer-banner": type === "footer-banner",
        },
        className
      )}
      data-testid={`ad-slot-${type}`}
    />
  );
}
