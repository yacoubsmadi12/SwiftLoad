import { useEffect, useRef } from "react";

interface AdBannerProps {
  slot: string;
  className?: string;
}

export function AdBanner({ slot, className }: AdBannerProps) {
  const insRef = useRef<HTMLModElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    if (!insRef.current) return;

    try {
      initialized.current = true;
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch {
      // silently ignore duplicate init errors
    }
  }, []);

  return (
    <ins
      ref={insRef}
      className={`adsbygoogle${className ? ` ${className}` : ""}`}
      style={{ display: "block" }}
      data-ad-client="ca-pub-1493226158255742"
      data-ad-slot={slot}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}
