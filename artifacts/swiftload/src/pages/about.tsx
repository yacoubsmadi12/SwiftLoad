import { motion } from "framer-motion";
import { Download, Zap, Shield, Globe, Users, Clock, Mail, Phone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const stats = [
  { label: "Supported Platforms", value: "20+" },
  { label: "File Formats", value: "10+" },
  { label: "Countries Reached", value: "100+" },
  { label: "Downloads Served", value: "∞" },
];

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Our infrastructure is optimized for speed. Paste a link, get your file — no waiting, no queues, no nonsense.",
  },
  {
    icon: Shield,
    title: "Private & Secure",
    description:
      "We don't store your URLs or downloaded files. Every session is ephemeral — your activity stays yours.",
  },
  {
    icon: Globe,
    title: "Multi-Platform",
    description:
      "YouTube, Instagram, TikTok, Twitter/X, Facebook, and dozens more. One tool for the entire web.",
  },
  {
    icon: Download,
    title: "Multiple Formats",
    description:
      "Download as MP4 video or extract the audio as MP3 — in the best available quality, every time.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.45 } }),
};

export default function About() {
  return (
    <div className="w-full">
      {/* Hero */}
      <section className="relative overflow-hidden py-24 lg:py-32">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-primary/20 blur-[120px] rounded-full pointer-events-none opacity-40" />
        <div className="container mx-auto px-4 max-w-4xl relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold uppercase tracking-wider mb-6">
              About SwiftLoad
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              The Fastest Way to{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">
                Own Your Content
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              SwiftLoad was built with one idea in mind — downloading a video or audio file from the
              internet should be instant, free, and require zero technical knowledge.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-y border-white/5 bg-card/40">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                custom={i}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={fadeUp}
                className="text-center"
              >
                <p className="text-3xl md:text-4xl font-extrabold text-white mb-1">{s.value}</p>
                <p className="text-sm text-muted-foreground">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-24">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
            <div className="space-y-4 text-muted-foreground text-lg leading-relaxed">
              <p>
                Content is everywhere — but it's not always available offline. Whether you're a
                creator archiving your own work, a student saving a lecture, or simply someone who
                wants to watch a video without buffering on a long flight, SwiftLoad gives you that
                freedom.
              </p>
              <p>
                We believe downloading content you have the right to access should be a one-click
                experience. No pop-ups. No fake download buttons. No suspicious software installs.
                Just paste a link and get your file.
              </p>
              <p>
                SwiftLoad is built and maintained by a single engineer who values simplicity, speed,
                and user privacy above all else. Every decision — from the UI to the infrastructure —
                reflects those values.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-card border-y border-white/5">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-white mb-4">Why SwiftLoad?</h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              A set of principles we refuse to compromise on.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                custom={i}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={fadeUp}
              >
                <Card className="bg-background border-white/10 h-full hover:border-primary/40 transition-colors duration-300">
                  <CardContent className="p-6 flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                      <f.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-lg mb-2">{f.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{f.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Developer */}
      <section className="py-24">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white mb-10">Meet the Developer</h2>
            <Card className="bg-card border-white/10">
              <CardContent className="p-8 flex flex-col sm:flex-row gap-8 items-center sm:items-start">
                <img
                  src="/developer.png"
                  alt="Eng. Yacoub Smadi"
                  className="w-28 h-28 rounded-full object-cover border-2 border-primary/40 shadow-xl shrink-0"
                />
                <div className="text-center sm:text-left">
                  <h3 className="text-xl font-bold text-white mb-1">Eng. Yacoub Smadi</h3>
                  <p className="text-primary text-sm font-medium mb-4">
                    Network Engineer &amp; Systems Developer
                  </p>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    A network engineer with a deep passion for systems development and automation.
                    With extensive experience in systems administration, cloud infrastructure, and
                    AI-driven tooling, Yacoub built SwiftLoad to solve a real daily problem — and
                    made it available to everyone, for free.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <a
                      href="tel:+962796734144"
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors"
                    >
                      <Phone className="w-4 h-4 text-primary" />
                      +962 796 734 144
                    </a>
                    <a
                      href="mailto:yakupsmadi@gmail.com"
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors"
                    >
                      <Mail className="w-4 h-4 text-primary" />
                      yakupsmadi@gmail.com
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-card border-t border-white/5">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Users className="w-12 h-12 text-primary mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">Join Millions of Downloads</h2>
            <p className="text-muted-foreground text-lg mb-8">
              Start downloading your favorite content right now. No sign-up, no limits.
            </p>
            <a
              href="/"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold text-lg transition-colors shadow-lg"
            >
              <Download className="w-5 h-5" />
              Try SwiftLoad Now
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
