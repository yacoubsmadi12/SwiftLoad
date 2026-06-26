import { Header } from "./header";
import { Footer } from "./footer";
import { AdSlot } from "./ad-slot";
import { LanguageProvider } from "@/hooks/use-language";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <div className="min-h-[100dvh] flex flex-col bg-background text-foreground dark selection:bg-primary/30">
        <Header />

        {/* Fixed side ad columns — desktop only */}
        <div className="hidden xl:flex fixed inset-y-0 left-0 w-[180px] items-center justify-center z-40 pointer-events-none pt-16">
          <div className="pointer-events-auto sticky top-1/2 -translate-y-1/2">
            <AdSlot type="left-sidebar" />
          </div>
        </div>
        <div className="hidden xl:flex fixed inset-y-0 right-0 w-[180px] items-center justify-center z-40 pointer-events-none pt-16">
          <div className="pointer-events-auto sticky top-1/2 -translate-y-1/2">
            <AdSlot type="right-sidebar" />
          </div>
        </div>

        <main className="flex-1 flex flex-col">
          {children}
        </main>
        <Footer />
      </div>
    </LanguageProvider>
  );
}
