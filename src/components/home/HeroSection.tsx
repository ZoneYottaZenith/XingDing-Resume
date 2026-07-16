import { useTranslations } from "@/i18n/compat/client";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, FileSearch } from "lucide-react";
import ScrollBackground from "./client/ScrollBackground";
import AnimatedFeature from "./client/AnimatedFeature";
import HeroBadge from "./client/HeroBadge";
import GoDashboard from "./GoDashboard";
import Image from "@/lib/image";
import { trackUsage } from "@/components/shared/UsageCounter";

export default function HeroSection() {
  const t = useTranslations("home");

  return (
    <section className="relative md:min-h-[90vh] flex flex-col items-center justify-center pt-20 pb-16 md:pt-32 md:pb-20 overflow-hidden bg-background">
      <ScrollBackground />
      
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10 opacity-30 pointer-events-none">
        <div className="absolute top-20 left-10 w-48 h-48 md:w-96 md:h-96 bg-primary/10 rounded-full blur-[120px] animate-blob" />
        <div className="absolute bottom-40 right-10 w-64 h-64 md:w-[500px] md:h-[500px] bg-primary/5 rounded-full blur-[150px] animate-blob animation-delay-2000" />
      </div>

      <div className="container relative z-10 mx-auto px-6 md:px-0 text-center max-w-4xl">
        <AnimatedFeature>
          <HeroBadge />
          
          <h1 className="text-xl md:text-7xl font-serif font-semibold tracking-tight leading-[1.1] mb-4 md:mb-8 text-foreground/90">
            {t("hero.title")}
          </h1>
          
          <p className="text-sm md:text-2xl text-muted-foreground mb-8 md:mb-12 max-w-2xl mx-auto leading-relaxed font-light">
            {t("hero.subtitle")}
          </p>

          <div className="flex flex-row items-center justify-center gap-2 md:gap-5">
            <div onClick={trackUsage}>
              <GoDashboard type="templates">
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-2xl h-9 px-3 text-xs md:h-14 md:px-10 md:text-lg font-medium border-border/60 hover:bg-secondary/80 active:scale-95 transition-all"
                >
                  <Play className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2 fill-current" />
                  {t("hero.secondary")}
                </Button>
              </GoDashboard>
            </div>

            <a href="https://cv1.sonnet.skin" target="_blank" rel="noopener noreferrer" onClick={trackUsage}>
              <Button
                variant="outline"
                size="lg"
                className="rounded-2xl h-9 px-3 text-xs md:h-14 md:px-10 md:text-lg font-medium border-border/60 hover:bg-secondary/80 active:scale-95 transition-all"
              >
                <FileSearch className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                {t("hero.resumeAnalysis")}
              </Button>
            </a>

            <div onClick={trackUsage}>
              <GoDashboard>
                <Button
                  size="lg"
                  className="rounded-2xl h-9 px-3 text-xs md:h-14 md:px-10 md:text-lg font-medium shadow-xl shadow-primary/20 hover:shadow-primary/30 active:scale-95 transition-all group"
                >
                  {t("hero.cta")}
                  <ArrowRight className="w-3 h-3 md:w-5 md:h-5 ml-1 md:ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </GoDashboard>
            </div>
          </div>
        </AnimatedFeature>

        <AnimatedFeature delay={0.3}>
          <div className="mt-10 md:mt-20 relative px-4 sm:px-0">
             <div className="absolute -inset-4 bg-gradient-to-b from-primary/5 to-transparent rounded-[3rem] blur-2xl -z-10" />
             <div className="relative rounded-3xl border border-border/50 bg-secondary/30 p-2 sm:p-4 backdrop-blur-sm shadow-2xl overflow-hidden group">
                <Image
                  src="/web-shot.png"
                  alt="Resume Editor Preview"
                  width={1200}
                  height={800}
                  className="rounded-2xl shadow-sm group-hover:scale-[1.01] transition-transform duration-700"
                  priority
                />
             </div>
          </div>
        </AnimatedFeature>
      </div>
    </section>
  );
}
