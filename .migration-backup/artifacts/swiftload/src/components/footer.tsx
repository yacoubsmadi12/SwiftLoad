import { Link } from "wouter";
import { Phone, Mail } from "lucide-react";
import { useTranslation } from "@/hooks/use-language";
import { AdSlot } from "./ad-slot";

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-white/10 bg-card mt-auto">

      {/* Developer profile section */}
      <div className="w-full border-b border-white/5 py-10 px-4">
        <div className="container mx-auto max-w-3xl flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-start">
          <img
            src="/developer.png"
            alt="Eng. Yacoub Smadi"
            className="w-24 h-24 rounded-full object-cover border-2 border-primary/40 shadow-lg shrink-0"
          />
          <div className="flex flex-col gap-2">
            <h3 className="text-white font-bold text-lg">Eng. Yacoub Smadi</h3>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xl">
              A network engineer passionate about systems development with extensive experience in systems administration and AI.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mt-2 items-center sm:items-start">
              <a
                href="tel:+962796734144"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors"
                data-testid="link-developer-phone"
              >
                <Phone className="w-4 h-4 text-primary shrink-0" />
                +962 796 734 144
              </a>
              <a
                href="mailto:yakupsmadi@gmail.com"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors"
                data-testid="link-developer-email"
              >
                <Mail className="w-4 h-4 text-primary shrink-0" />
                yakupsmadi@gmail.com
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer banner ad slot */}
      <div className="w-full border-b border-white/5 py-4 px-4 flex items-center justify-center">
        <AdSlot type="footer-banner" />
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <img src="/favicon.png" alt="SwiftLoad" className="w-6 h-6 object-contain" />
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
