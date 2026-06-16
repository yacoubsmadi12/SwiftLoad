import { useTranslation } from "@/hooks/use-language";

export default function Terms() {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 py-24 max-w-3xl">
      <h1 className="text-4xl font-bold mb-8 text-white">{t("terms.title")}</h1>
      <div className="prose prose-invert max-w-none text-muted-foreground">
        <p className="text-lg leading-relaxed">{t("terms.content")}</p>
      </div>
    </div>
  );
}
