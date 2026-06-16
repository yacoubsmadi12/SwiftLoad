import React, { createContext, useContext, useEffect, useState } from "react";

type Language = "en" | "ar";

interface LanguageContextType {
  lang: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: keyof typeof translations.en) => string;
}

export const translations = {
  en: {
    "app.name": "SwiftLoad",
    "header.about": "About",
    "header.faq": "FAQ",
    "header.terms": "Terms",
    "header.privacy": "Privacy",
    "hero.headline": "Download Anything. Instantly.",
    "hero.subheadline": "YouTube, Instagram, TikTok, Twitter, Facebook & more",
    "home.input.placeholder": "Paste your link here...",
    "home.input.button": "Detect & Analyze",
    "home.format.choose": "Choose Format",
    "home.format.video": "Video (MP4)",
    "home.format.audio": "Audio (MP3)",
    "home.format.original": "Original File",
    "home.download": "Download",
    "home.supported": "Supported Platforms",
    "home.how_it_works": "How It Works",
    "home.step1.title": "Paste Link",
    "home.step1.desc": "Copy the media link and paste it into our tool.",
    "home.step2.title": "Detect & Analyze",
    "home.step2.desc": "We instantly analyze the link and extract available formats.",
    "home.step3.title": "Download",
    "home.step3.desc": "Choose your preferred format and download securely.",
    "about.title": "About SwiftLoad",
    "about.content": "SwiftLoad is a precision tool designed for power users who need fast, reliable media downloads. We support a wide range of platforms and provide instant extraction.",
    "faq.title": "Frequently Asked Questions",
    "faq.q1": "Is it free to use?",
    "faq.a1": "Yes, SwiftLoad is completely free to use.",
    "faq.q2": "What platforms are supported?",
    "faq.a2": "We currently support YouTube, Instagram, TikTok, Twitter/X, Facebook, and many others.",
    "terms.title": "Terms of Service",
    "terms.content": "By using SwiftLoad, you agree to our terms of service. Do not download copyrighted material without permission.",
    "privacy.title": "Privacy Policy",
    "privacy.content": "We do not store your download history or personal data. We use standard web analytics to improve the service.",
    "error.invalid_url": "Please enter a valid URL.",
    "error.fetch_failed": "Failed to analyze link. Please try again.",
    "success.download_started": "Download started!",
    "footer.copyright": "© 2024 SwiftLoad. All rights reserved.",
  },
  ar: {
    "app.name": "SwiftLoad",
    "header.about": "حول",
    "header.faq": "الأسئلة الشائعة",
    "header.terms": "الشروط",
    "header.privacy": "الخصوصية",
    "hero.headline": "حمّل أي شيء. فوراً.",
    "hero.subheadline": "يوتيوب، إنستغرام، تيك توك، تويتر، فيسبوك والمزيد",
    "home.input.placeholder": "الصق الرابط هنا...",
    "home.input.button": "تحليل الرابط",
    "home.format.choose": "اختر الصيغة",
    "home.format.video": "فيديو (MP4)",
    "home.format.audio": "صوت (MP3)",
    "home.format.original": "الملف الأصلي",
    "home.download": "تحميل",
    "home.supported": "المنصات المدعومة",
    "home.how_it_works": "كيف يعمل",
    "home.step1.title": "الصق الرابط",
    "home.step1.desc": "انسخ رابط الوسائط والصقه في أداتنا.",
    "home.step2.title": "تحليل الرابط",
    "home.step2.desc": "نقوم بتحليل الرابط فوراً واستخراج الصيغ المتاحة.",
    "home.step3.title": "تحميل",
    "home.step3.desc": "اختر الصيغة المفضلة لديك وحمّل بأمان.",
    "about.title": "حول SwiftLoad",
    "about.content": "SwiftLoad هي أداة دقيقة مصممة للمستخدمين المحترفين الذين يحتاجون إلى تنزيلات وسائط سريعة وموثوقة. نحن ندعم مجموعة واسعة من المنصات ونوفر استخراجاً فورياً.",
    "faq.title": "الأسئلة الشائعة",
    "faq.q1": "هل الاستخدام مجاني؟",
    "faq.a1": "نعم، SwiftLoad مجاني تماماً للاستخدام.",
    "faq.q2": "ما هي المنصات المدعومة؟",
    "faq.a2": "ندعم حالياً يوتيوب، إنستغرام، تيك توك، تويتر/X، فيسبوك، والعديد من المنصات الأخرى.",
    "terms.title": "شروط الخدمة",
    "terms.content": "باستخدامك SwiftLoad، فإنك توافق على شروط الخدمة الخاصة بنا. لا تقم بتنزيل المواد المحمية بحقوق الطبع والنشر دون إذن.",
    "privacy.title": "سياسة الخصوصية",
    "privacy.content": "نحن لا نخزن سجل التنزيلات الخاص بك أو بياناتك الشخصية. نستخدم تحليلات الويب القياسية لتحسين الخدمة.",
    "error.invalid_url": "يرجى إدخال رابط صحيح.",
    "error.fetch_failed": "فشل تحليل الرابط. يرجى المحاولة مرة أخرى.",
    "success.download_started": "بدأ التحميل!",
    "footer.copyright": "© 2024 SwiftLoad. جميع الحقوق محفوظة.",
  }
};

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>("en");

  useEffect(() => {
    const saved = localStorage.getItem("swiftload-lang") as Language;
    if (saved && (saved === "en" || saved === "ar")) {
      setLangState(saved);
    }
  }, []);

  const setLanguage = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem("swiftload-lang", newLang);
  };

  const toggleLanguage = () => {
    setLanguage(lang === "en" ? "ar" : "en");
  };

  useEffect(() => {
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  }, [lang]);

  const t = (key: keyof typeof translations.en) => {
    return translations[lang][key] || translations.en[key];
  };

  return React.createElement(
    LanguageContext.Provider,
    { value: { lang, setLanguage, toggleLanguage, t } },
    children
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useTranslation must be used within LanguageProvider");
  }
  return context;
}

export function useLanguageStore() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguageStore must be used within LanguageProvider");
  }
  return context;
}
