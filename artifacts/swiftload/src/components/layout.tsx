import { Header } from "./header";
import { Footer } from "./footer";
import { LanguageProvider } from "@/hooks/use-language";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <div className="min-h-[100dvh] flex flex-col bg-background text-foreground dark selection:bg-primary/30">
        <Header />
        <main className="flex-1 flex flex-col">
          {children}
        </main>
        <Footer />
      </div>
    </LanguageProvider>
  );
}
