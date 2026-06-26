import { motion } from "framer-motion";
import { ScrollText } from "lucide-react";

const sections = [
  {
    title: "1. Acceptance of Terms",
    body: `By accessing or using SwiftLoad ("the Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use the Service. These Terms apply to all visitors, users, and others who access or use the Service.`,
  },
  {
    title: "2. Description of Service",
    body: `SwiftLoad is a free, web-based media downloading utility that allows users to download publicly accessible video and audio content from supported third-party platforms. The Service does not host, store, or cache any media content. All processing is performed in real time and any temporary files are deleted immediately upon delivery.`,
  },
  {
    title: "3. Permitted Use",
    body: `You may use SwiftLoad solely for lawful purposes and in accordance with these Terms. You agree that you will not use the Service to: (a) download, copy, or distribute content in violation of any applicable copyright, trademark, or other intellectual property laws; (b) circumvent any access controls or technical protection measures; (c) use automated scripts, bots, or crawlers to make excessive requests to the Service; (d) attempt to interfere with, compromise, or disrupt the Service's servers or networks; or (e) violate the Terms of Service of any third-party platform from which content is downloaded.`,
  },
  {
    title: "4. Intellectual Property & Copyright",
    body: `SwiftLoad does not condone or encourage copyright infringement. You are solely and entirely responsible for ensuring you have the legal right to download and use any content retrieved through the Service. This may include: (a) content you personally created and own; (b) content licensed under Creative Commons or similar open licenses; (c) content that is in the public domain; or (d) content for which you have obtained explicit written permission from the copyright holder. We reserve the right to suspend or terminate access to users who repeatedly infringe or are believed to be infringing upon the intellectual property rights of others.`,
  },
  {
    title: "5. Disclaimer of Warranties",
    body: `The Service is provided on an "AS IS" and "AS AVAILABLE" basis without any warranties of any kind, either express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, or non-infringement. SwiftLoad does not warrant that: (a) the Service will be uninterrupted, error-free, or available at any particular time; (b) any particular content will be downloadable at any given time; (c) the Service will meet your requirements or expectations; or (d) any defects in the Service will be corrected.`,
  },
  {
    title: "6. Limitation of Liability",
    body: `To the maximum extent permitted by applicable law, SwiftLoad and its developer shall not be liable for any indirect, incidental, special, consequential, or punitive damages — including but not limited to loss of profits, data, or goodwill — arising out of or in connection with your use of, or inability to use, the Service. In no event shall SwiftLoad's total liability to you for all claims arising out of or related to the Service exceed one hundred U.S. dollars (USD $100).`,
  },
  {
    title: "7. Third-Party Services",
    body: `SwiftLoad relies on third-party platforms and tools to deliver its functionality. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party platforms. We are not responsible for any changes made by third-party platforms that affect the availability or functionality of the Service.`,
  },
  {
    title: "8. Advertising",
    body: `SwiftLoad uses Google AdSense to display advertisements in order to support the free operation of the Service. Google may use cookies and similar technologies to serve ads based on your prior visits to this or other websites. You can opt out of personalized advertising by visiting Google's Ads Settings. We do not have access to or control over cookies used by third-party advertisers.`,
  },
  {
    title: "9. Modifications to the Service",
    body: `SwiftLoad reserves the right to modify, suspend, or discontinue any part of the Service at any time with or without notice. We may also update these Terms from time to time. Continued use of the Service after any changes constitutes your acceptance of the new Terms. We encourage you to review these Terms periodically.`,
  },
  {
    title: "10. Governing Law",
    body: `These Terms shall be governed by and construed in accordance with the laws of the Hashemite Kingdom of Jordan, without regard to its conflict of law provisions. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts located in Jordan.`,
  },
  {
    title: "11. Contact",
    body: `If you have any questions about these Terms of Service, please contact us at: yakupsmadi@gmail.com`,
  },
];

export default function Terms() {
  return (
    <div className="w-full">
      {/* Hero */}
      <section className="relative overflow-hidden py-24 lg:py-28 border-b border-white/5">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] bg-primary/10 blur-[100px] rounded-full pointer-events-none opacity-50" />
        <div className="container mx-auto px-4 max-w-3xl relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <ScrollText className="w-5 h-5 text-primary" />
              </div>
              <span className="text-primary text-sm font-semibold uppercase tracking-wider">Legal</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Terms of Service</h1>
            <p className="text-muted-foreground text-lg">
              Last updated: <span className="text-white font-medium">June 2025</span>
            </p>
            <p className="text-muted-foreground mt-4 leading-relaxed">
              Please read these Terms carefully before using SwiftLoad. By using the Service, you
              agree to be bound by these Terms.
            </p>
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
              Questions about these terms?{" "}
              <a href="mailto:yakupsmadi@gmail.com" className="text-primary hover:underline font-medium">
                Contact us
              </a>{" "}
              and we'll respond as quickly as possible.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
