import { useTranslation } from "@/hooks/use-language";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQ() {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 py-24 max-w-3xl">
      <h1 className="text-4xl font-bold mb-8 text-white">{t("faq.title")}</h1>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger className="text-lg font-semibold hover:text-primary">{t("faq.q1")}</AccordionTrigger>
          <AccordionContent className="text-muted-foreground text-base">
            {t("faq.a1")}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger className="text-lg font-semibold hover:text-primary">{t("faq.q2")}</AccordionTrigger>
          <AccordionContent className="text-muted-foreground text-base">
            {t("faq.a2")}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
