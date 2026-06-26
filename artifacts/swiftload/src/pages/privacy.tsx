import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";

const sections = [
  {
    title: "1. Introduction",
    body: `SwiftLoad ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains what information we collect when you use SwiftLoad (the "Service"), how we use it, and the choices you have regarding your information. By using the Service, you agree to the collection and use of information in accordance with this policy.`,
  },
  {
    title: "2. Information We Collect",
    body: `We collect the minimum information necessary to operate the Service. This includes: (a) Usage Data — anonymous, aggregate data about how the Service is accessed, such as browser type, device type, pages visited, and time spent. This data is collected through standard web analytics tools and cannot be used to identify you personally. (b) URLs you submit — URLs you paste into SwiftLoad are sent to our server solely for the purpose of processing your download request. We do not log, store, or analyze these URLs after your request is fulfilled. They are never associated with your identity or IP address in any persistent way.`,
  },
  {
    title: "3. Information We Do NOT Collect",
    body: `SwiftLoad does not collect, store, or process: your name, email address, phone number, or any other personally identifying information; your IP address in persistent logs; the content of your downloads; authentication tokens or cookies from third-party platforms; or payment information of any kind. We have intentionally designed the Service to require no account and no personal data.`,
  },
  {
    title: "4. Cookies",
    body: `SwiftLoad itself does not use cookies for tracking or authentication. However, third-party advertising providers (specifically Google AdSense) may set cookies on your device when ads are displayed. These cookies are used by Google to deliver personalized or contextually relevant advertisements. We do not have access to or control over these cookies. You can manage or disable cookies through your browser settings, or opt out of personalized advertising at Google's Ad Settings page (https://adssettings.google.com).`,
  },
  {
    title: "5. Third-Party Advertising",
    body: `We use Google AdSense to serve advertisements on the Service. Google, as a third-party vendor, uses cookies to serve ads based on a user's prior visits to our website and other websites on the internet. Google's use of advertising cookies enables it and its partners to serve ads to our users based on their visit to our site and/or other sites on the internet. Users may opt out of personalized advertising by visiting Google's Ads Preferences Manager. We encourage you to review Google's Privacy Policy for more information on how Google collects and uses data.`,
  },
  {
    title: "6. Data Retention",
    body: `We do not retain any personally identifiable information. Temporary server-side data generated during a download request (such as temporary files) is deleted immediately and automatically upon completion or failure of the download. Web server access logs, if any, are automatically purged on a rolling basis and contain only standard, non-identifying HTTP request metadata.`,
  },
  {
    title: "7. Data Security",
    body: `We take reasonable technical and organizational measures to protect the Service and any incidentally collected data from unauthorized access, disclosure, alteration, or destruction. All communications between your browser and our servers are encrypted using industry-standard TLS (HTTPS). However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.`,
  },
  {
    title: "8. Children's Privacy",
    body: `SwiftLoad is not directed to individuals under the age of 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately and we will take steps to delete such information.`,
  },
  {
    title: "9. Links to External Sites",
    body: `The Service may contain links to third-party websites or platforms. This Privacy Policy does not apply to those third-party sites. We have no control over their content or privacy practices and encourage you to read their respective privacy policies.`,
  },
  {
    title: "10. Changes to This Policy",
    body: `We may update this Privacy Policy from time to time. When we do, we will revise the "Last updated" date at the top of this page. We encourage you to review this Privacy Policy periodically to stay informed about how we protect your information. Continued use of the Service after any changes constitutes your acceptance of the revised policy.`,
  },
  {
    title: "11. Your Rights",
    body: `Depending on your jurisdiction, you may have rights regarding your personal data — including the right to access, correct, or request deletion of information we hold about you. Since we do not collect or retain personally identifiable information, most such requests are not applicable. However, if you have a specific concern, please reach out and we will respond promptly.`,
  },
  {
    title: "12. Contact Us",
    body: `If you have any questions, concerns, or requests related to this Privacy Policy, please contact us at: yakupsmadi@gmail.com. We aim to respond to all inquiries within 48 hours.`,
  },
];

export default function Privacy() {
  return (
    <div className="w-full">
      {/* Hero */}
      <section className="relative overflow-hidden py-24 lg:py-28 border-b border-white/5">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] bg-primary/10 blur-[100px] rounded-full pointer-events-none opacity-50" />
        <div className="container mx-auto px-4 max-w-3xl relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-primary" />
              </div>
              <span className="text-primary text-sm font-semibold uppercase tracking-wider">Legal</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Privacy Policy</h1>
            <p className="text-muted-foreground text-lg">
              Last updated: <span className="text-white font-medium">June 2025</span>
            </p>
            <p className="text-muted-foreground mt-4 leading-relaxed max-w-2xl">
              Your privacy matters to us. SwiftLoad is designed from the ground up to collect as
              little data as possible. Here's exactly what we do — and don't — collect.
            </p>

            {/* Privacy promise chips */}
            <div className="flex flex-wrap gap-3 mt-8">
              {[
                "No account required",
                "No URL logging",
                "No personal data stored",
                "HTTPS encrypted",
              ].map((label) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {label}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 pb-32">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="space-y-10">
            {sections.map((section, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04, duration: 0.4 }}
              >
                <h2 className="text-xl font-bold text-white mb-3">{section.title}</h2>
                <p className="text-muted-foreground leading-relaxed">{section.body}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-16 p-6 rounded-xl border border-white/10 bg-card text-center"
          >
            <p className="text-muted-foreground text-sm">
              Privacy concerns?{" "}
              <a href="mailto:yakupsmadi@gmail.com" className="text-primary hover:underline font-medium">
                Contact us
              </a>{" "}
              — we take every inquiry seriously.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
