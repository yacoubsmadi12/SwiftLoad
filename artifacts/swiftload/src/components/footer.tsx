import { Link } from "wouter";
import { Zap } from "lucide-react";
import { useTranslation } from "@/hooks/use-language";
import { AdSlot } from "./ad-slot";

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-white/10 bg-card mt-auto">

      {/* Footer banner ad slot */}
      <div className="w-full border-b border-white/5 py-4 px-4 flex items-center justify-center">
        <AdSlot type="footer-banner" />
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded bg-primary-gradient flex items-center justify-center text-white">
                <Zap className="w-3 h-3 fill-current" />
              </div>
              <span className="font-bold text-white">{t("app.name")}</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-sm">
              {t("hero.subheadline")}
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-4">SwiftLoad</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-white transition-colors">
                  {t("header.about")}
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm text-muted-foreground hover:text-white transition-colors">
                  {t("header.faq")}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="text-sm text-muted-foreground hover:text-white transition-colors">
                  {t("header.terms")}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-muted-foreground hover:text-white transition-colors">
                  {t("header.privacy")}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-white/10 flex items-center justify-center">
          <p className="text-xs text-muted-foreground text-center">
            {t("footer.copyright")}
          </p>
        </div>
      </div>
    </footer>
  );
}
