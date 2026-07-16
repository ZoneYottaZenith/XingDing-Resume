import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { useTranslations } from "@/i18n/compat/client";
import AnimatedFeature from "./client/AnimatedFeature";
import GoDashboard from "./GoDashboard";
import { trackUsage } from "@/components/shared/UsageCounter";

export default function CTASection() {
  const t = useTranslations("home");

  return (
    <section className="py-12 md:py-44 bg-secondary/30 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 blur-[120px] -z-10 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-1/3 h-full bg-primary/5 blur-[120px] -z-10 -translate-x-1/2" />
      
      <div className="container mx-auto px-6 max-w-4xl relative text-center">
        <AnimatedFeature>
          <div className="flex flex-col items-center">
            <div className="p-2 md:p-3 rounded-2xl bg-primary/10 text-primary mb-5 md:mb-8">
              <Sparkles className="w-6 h-6 md:w-8 md:h-8" />
            </div>
            
            <h2 className="text-2xl md:text-6xl font-serif font-semibold tracking-tight text-foreground/90 mb-4 md:mb-8 leading-[1.15]">
              {t("cta.title")}
            </h2>
            
            <p className="text-base md:text-2xl text-muted-foreground/80 mb-8 md:mb-14 max-w-2xl font-light leading-relaxed">
              {t("cta.description")}
            </p>
            
            <div onClick={trackUsage}>
              <GoDashboard>
                <Button 
                  size="lg" 
                  className="rounded-2xl h-11 px-8 text-base md:h-16 md:px-12 md:text-xl font-medium shadow-2xl shadow-primary/30 hover:shadow-primary/40 active:scale-95 transition-all group"
                >
                  {t("cta.button")}
                  <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1.5 transition-transform" />
                </Button>
              </GoDashboard>
            </div>

          </div>
        </AnimatedFeature>
      </div>
    </section>
  );
}
