import { Link } from "wouter";
import { Zap } from "lucide-react";
import { useLanguageStore, useTranslation } from "@/hooks/use-language";
import { Button } from "@/components/ui/button";

export function Header() {
  const { toggleLanguage, lang } = useLanguageStore();
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group" data-testid="link-home">
          <div className="w-8 h-8 rounded-lg bg-primary-gradient flex items-center justify-center text-white">
            <Zap className="w-4 h-4 fill-current" />
          </div>
          <span className="font-bold text-lg tracking-tight text-white group-hover:text-white/80 transition-colors">
            {t("app.name")}
          </span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/about" className="text-sm font-medium text-muted-foreground hover:text-white transition-colors" data-testid="link-about">
            {t("header.about")}
          </Link>
          <Link href="/faq" className="text-sm font-medium text-muted-foreground hover:text-white transition-colors" data-testid="link-faq">
            {t("header.faq")}
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleLanguage}
            className="font-medium text-muted-foreground hover:text-white font-mono"
            data-testid="button-lang-toggle"
          >
            {lang === "en" ? "عربي" : "EN"}
          </Button>
        </div>
      </div>
    </header>
  );
}
