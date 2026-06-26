import { motion } from "framer-motion";
import { HelpCircle, MessageCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "What is SwiftLoad?",
    a: "SwiftLoad is a free, browser-based tool that lets you download videos and audio from popular platforms like YouTube, Instagram, TikTok, Twitter/X, Facebook, and many more. Just paste a link and choose your format — no software installation required.",
  },
  {
    q: "Which platforms are supported?",
    a: "SwiftLoad supports over 20 platforms including YouTube, Instagram, TikTok, Twitter/X, Facebook, Dailymotion, Vimeo, Reddit, SoundCloud, and many others. If a platform is publicly accessible, there's a good chance we support it.",
  },
  {
    q: "What file formats can I download?",
    a: "You can download content as MP4 (video) or MP3 (audio only). We always fetch the best available quality for your chosen format. For direct file links, we also support downloading the original file as-is.",
  },
  {
    q: "Is SwiftLoad free to use?",
    a: "Yes — completely free. There are no hidden fees, no premium tiers, and no account required. SwiftLoad is sustained through non-intrusive advertising.",
  },
  {
    q: "Do I need to create an account?",
    a: "No. SwiftLoad requires zero registration. There are no accounts, no sign-ups, and no personal information collected. Open the site, paste a link, download your file.",
  },
  {
    q: "Is my privacy protected?",
    a: "Absolutely. SwiftLoad does not store the URLs you submit, does not log your downloads, and does not share any data with third parties beyond standard analytics. Downloaded files are processed in memory and immediately discarded after delivery.",
  },
  {
    q: "Why is my download taking a long time?",
    a: "Download speed depends on several factors: the length and quality of the video, the source platform's server speed, and your own internet connection. For very long videos (over 1 hour), processing may take a minute or two before the download starts. Please be patient.",
  },
  {
    q: "Can I download copyrighted content?",
    a: "SwiftLoad is a tool — like any tool, it can be used responsibly or irresponsibly. You are solely responsible for ensuring you have the legal right to download and use any content. Downloading copyrighted material without permission may violate the platform's Terms of Service and applicable laws. We do not condone copyright infringement.",
  },
  {
    q: "Why did the analysis fail for my link?",
    a: "Some platforms protect their content behind authentication, age gates, or geo-restrictions. Links to private content, members-only videos, or stories that have expired will not work. Also, make sure you're pasting the full URL (starting with https://).",
  },
  {
    q: "Is there a limit on how many downloads I can do?",
    a: "There is no hard limit enforced for normal use. However, we reserve the right to rate-limit or block IPs that are making an unusually high number of requests in a short period of time, to protect the service for all users.",
  },
];

export default function FAQ() {
  return (
    <div className="w-full">
      {/* Hero */}
      <section className="relative overflow-hidden py-24 lg:py-28">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/15 blur-[100px] rounded-full pointer-events-none opacity-50" />
        <div className="container mx-auto px-4 max-w-3xl relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold uppercase tracking-wider mb-6">
              FAQ
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Everything you need to know about SwiftLoad. Can't find your answer?{" "}
              <a href="mailto:yakupsmadi@gmail.com" className="text-primary hover:underline">
                Reach out directly.
              </a>
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ List */}
      <section className="pb-32">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
          >
            <Accordion type="single" collapsible className="w-full space-y-3">
              {faqs.map((item, i) => (
                <AccordionItem
                  key={i}
                  value={`item-${i}`}
                  className="bg-card border border-white/10 rounded-xl px-6 data-[state=open]:border-primary/30 transition-colors duration-200"
                >
                  <AccordionTrigger className="text-base md:text-lg font-semibold text-white hover:text-primary hover:no-underline py-5 text-left">
                    <span className="flex items-start gap-3">
                      <HelpCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      {item.q}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-5 pl-8">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>

          {/* Contact CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 rounded-2xl bg-card border border-white/10 p-8 text-center"
          >
            <MessageCircle className="w-10 h-10 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Still have a question?</h3>
            <p className="text-muted-foreground mb-6">
              Our developer reads every message personally. Don't hesitate to reach out.
            </p>
            <a
              href="mailto:yakupsmadi@gmail.com"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary hover:bg-primary/90 text-white font-semibold transition-colors"
            >
              Send a Message
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
