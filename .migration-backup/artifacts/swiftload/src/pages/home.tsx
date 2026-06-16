import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/hooks/use-language";
import { AdSlot } from "@/components/ad-slot";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useGetMediaInfo, useStartDownload } from "@workspace/api-client-react";
import { SiYoutube, SiInstagram, SiTiktok, SiX, SiFacebook } from "react-icons/si";
import { Search, Clipboard, Loader2, Download, Play, Music, FileBox, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export default function Home() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [url, setUrl] = useState("");
  const [selectedFormat, setSelectedFormat] = useState<string>("mp4");

  const getMediaInfo = useGetMediaInfo();
  const startDownload = useStartDownload();

  const handleAnalyze = () => {
    if (!url.trim() || !url.startsWith("http")) {
      toast({
        title: t("error.invalid_url"),
        variant: "destructive",
      });
      return;
    }
    
    getMediaInfo.mutate({ data: { url } }, {
      onError: () => {
        toast({
          title: t("error.fetch_failed"),
          variant: "destructive",
        });
      }
    });
  };

  const handleDownload = () => {
    if (!url || !selectedFormat) return;
    
    startDownload.mutate({ data: { url, format: selectedFormat } }, {
      onSuccess: (data) => {
        toast({
          title: t("success.download_started"),
          description: data.filename,
        });
        window.location.href = `/api/download/stream?token=${data.token}`;
      },
      onError: () => {
        toast({
          title: t("error.fetch_failed"),
          variant: "destructive",
        });
      }
    });
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
    } catch (err) {
      console.error("Failed to read clipboard", err);
    }
  };

  const info = getMediaInfo.data;

  return (
    <div className="w-full">
      <section className="relative overflow-hidden pt-12 pb-24 lg:pt-20 lg:pb-32">
        {/* Background glow effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/20 blur-[120px] rounded-full pointer-events-none opacity-50" />
        
        <div className="container mx-auto px-4 max-w-5xl relative z-10">
          
          <div className="mb-10 max-w-3xl mx-auto">
            <AdSlot type="top-banner" />
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              <span className="text-primary-gradient">{t("hero.headline")}</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground font-medium">
              {t("hero.subheadline")}
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-3xl mx-auto"
          >
            <div className="relative group">
              <div className="absolute -inset-1 bg-primary-gradient rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-500" />
              <div className="relative flex flex-col md:flex-row gap-3 bg-card border border-white/10 p-3 rounded-xl shadow-2xl">
                <div className="relative flex-1 flex items-center">
                  <Input 
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder={t("home.input.placeholder")}
                    className="flex-1 h-14 bg-transparent border-none text-lg focus-visible:ring-0 px-4 placeholder:text-muted-foreground"
                    data-testid="input-url"
                  />
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute right-2 text-muted-foreground hover:text-white"
                    onClick={handlePaste}
                    title="Paste from clipboard"
                  >
                    <Clipboard className="w-5 h-5" />
                  </Button>
                </div>
                <Button 
                  size="lg" 
                  className="h-14 px-8 text-base bg-primary hover:bg-primary/90 text-white shadow-lg"
                  onClick={handleAnalyze}
                  disabled={getMediaInfo.isPending}
                  data-testid="button-analyze"
                >
                  {getMediaInfo.isPending ? (
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  ) : (
                    <Search className="w-5 h-5 mr-2" />
                  )}
                  {t("home.input.button")}
                </Button>
              </div>
            </div>

            <div className="mt-8 flex flex-col items-center">
              <p className="text-sm text-muted-foreground mb-4 font-medium uppercase tracking-wider">{t("home.supported")}</p>
              <div className="flex flex-wrap justify-center gap-6 text-muted-foreground">
                <SiYoutube className="w-6 h-6 hover:text-[#FF0000] transition-colors" />
                <SiInstagram className="w-6 h-6 hover:text-[#E4405F] transition-colors" />
                <SiTiktok className="w-6 h-6 hover:text-white transition-colors" />
                <SiX className="w-6 h-6 hover:text-white transition-colors" />
                <SiFacebook className="w-6 h-6 hover:text-[#1877F2] transition-colors" />
              </div>
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            {info && (
              <motion.div 
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: "auto", marginTop: 64 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                className="max-w-5xl mx-auto overflow-hidden"
              >
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
                  <div className="space-y-8">
                    <Card className="bg-card border-white/10 overflow-hidden shadow-xl">
                      <CardContent className="p-0">
                        <div className="flex flex-col sm:flex-row gap-6 p-6">
                          {info.thumbnail ? (
                            <div className="w-full sm:w-48 aspect-video sm:aspect-square bg-muted rounded-lg overflow-hidden shrink-0">
                              <img src={info.thumbnail} alt={info.title} className="w-full h-full object-cover" />
                            </div>
                          ) : (
                            <div className="w-full sm:w-48 aspect-video sm:aspect-square bg-muted/50 rounded-lg flex items-center justify-center shrink-0">
                              <FileBox className="w-12 h-12 text-muted-foreground/50" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0 flex flex-col justify-center">
                            <div className="inline-flex px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-3 w-fit">
                              {info.platform}
                            </div>
                            <h3 className="font-bold text-xl text-white mb-2 line-clamp-2" title={info.title}>{info.title}</h3>
                            {info.duration && (
                              <p className="text-sm text-muted-foreground mb-4">
                                {Math.floor(info.duration / 60)}:{String(info.duration % 60).padStart(2, '0')}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        <div className="border-t border-white/10 bg-white/[0.02] p-6">
                          <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-primary" />
                            {t("home.format.choose")}
                          </h4>
                          
                          <RadioGroup value={selectedFormat} onValueChange={setSelectedFormat} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                            {info.formats.map((format) => (
                              <div key={format.id}>
                                <RadioGroupItem value={format.id} id={`format-${format.id}`} className="peer sr-only" />
                                <Label
                                  htmlFor={`format-${format.id}`}
                                  className="flex flex-col items-center justify-between rounded-md border-2 border-white/10 bg-card p-4 hover:bg-white/[0.05] hover:border-white/20 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all"
                                >
                                  {format.type === 'mp4' ? <Play className="mb-3 w-6 h-6 text-primary" /> : 
                                   format.type === 'mp3' ? <Music className="mb-3 w-6 h-6 text-primary" /> : 
                                   <FileBox className="mb-3 w-6 h-6 text-primary" />}
                                  <span className="font-semibold">{format.label}</span>
                                  {format.quality && <span className="text-xs text-muted-foreground mt-1">{format.quality}</span>}
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>

                          <Button 
                            className="w-full h-14 text-lg font-semibold bg-primary hover:bg-primary/90 text-white shadow-lg"
                            onClick={handleDownload}
                            disabled={startDownload.isPending}
                            data-testid="button-download"
                          >
                            {startDownload.isPending ? (
                              <Loader2 className="w-6 h-6 animate-spin mr-2" />
                            ) : (
                              <Download className="w-6 h-6 mr-2" />
                            )}
                            {t("home.download")}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    <AdSlot type="below-download" />
                  </div>

                  <div className="hidden lg:block">
                    <div className="sticky top-24">
                      <AdSlot type="sidebar" />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <section className="py-24 bg-card border-t border-white/5">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">{t("home.how_it_works")}</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0" />
            
            {[
              { icon: Clipboard, title: t("home.step1.title"), desc: t("home.step1.desc") },
              { icon: Search, title: t("home.step2.title"), desc: t("home.step2.desc") },
              { icon: Download, title: t("home.step3.title"), desc: t("home.step3.desc") },
            ].map((step, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center text-center p-6">
                <div className="w-20 h-20 rounded-2xl bg-background border border-white/10 shadow-xl flex items-center justify-center mb-6 relative">
                  <div className="absolute inset-0 bg-primary/10 rounded-2xl" />
                  <step.icon className="w-8 h-8 text-primary relative z-10" />
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm border-4 border-background">
                    {i + 1}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
