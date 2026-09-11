
'use client';

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Heart, Globe, CheckCircle2, Loader2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useFirestore, useDoc } from "@/firebase";
import { doc } from "firebase/firestore";
import { useLanguage } from "@/components/language-provider";

export default function Home() {
  const db = useFirestore();
  const { t } = useLanguage();
  
  const settingsRef = React.useMemo(() => {
    if (!db) return null;
    return doc(db, "site_settings", "general");
  }, [db]);

  const { data: settings, loading } = useDoc(settingsRef);

  const stats = React.useMemo(() => {
    const s = settings?.stats || {};
    return [
      { 
        label: t.home.stats.beneficiaries, 
        value: s.beneficiaries || "2.5M+", 
        icon: Heart 
      },
      { 
        label: t.home.stats.countries, 
        value: s.countries || "35", 
        icon: Globe 
      },
      { 
        label: t.home.stats.projects, 
        value: s.projects || "1,200+", 
        icon: CheckCircle2 
      },
      { 
        label: t.home.stats.volunteers, 
        value: s.volunteers || "15,000+", 
        icon: Users 
      },
    ];
  }, [settings, t]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  const heroImage = settings?.heroImageUrl || PlaceHolderImages.find(i => i.id === "hero-humanitarian")?.imageUrl || "https://picsum.photos/seed/hero/1200/600";
  const slogan = settings?.slogan || t.home.slogan;

  return (
    <div className="flex flex-col gap-0 animate-in fade-in duration-700">
      <section className="relative min-h-[90vh] flex items-center overflow-hidden py-20 md:py-0">
        <div className="absolute inset-0 bg-zinc-900">
          {heroImage && (
            <Image
              src={heroImage}
              alt={t.home.heroTitle}
              fill
              className="object-cover brightness-[0.4]"
              priority
            />
          )}
        </div>
        <div className="container relative mx-auto px-4 z-10 text-white space-y-8 max-w-4xl">
          <div className="inline-block px-4 py-1 rounded-full bg-secondary/80 backdrop-blur-sm text-xs md:text-sm font-bold tracking-wider uppercase mb-4">
            {slogan}
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-headline font-bold leading-tight">
            {t.home.heroTitle.split(',')[0]}, <br className="hidden sm:block" />
            <span className="text-secondary">{t.home.heroTitle.split(',')[1]}</span>
          </h1>
          <p className="text-lg md:text-2xl text-white/90 leading-relaxed max-w-2xl">
            {t.home.heroSubtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link href="/donate" className="w-full sm:w-auto">
              <Button size="lg" className="w-full bg-secondary hover:bg-secondary/90 text-white text-lg font-bold px-8 h-14 shadow-xl rounded-full">
                {t.home.btnDonate}
              </Button>
            </Link>
            <Link href="/volunteer" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full bg-white/10 hover:bg-white/20 border-white/40 text-white text-lg font-bold px-8 h-14 backdrop-blur-sm rounded-full">
                {t.home.btnVolunteer}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white dark:bg-zinc-900 py-12 md:py-20 -mt-10 relative z-20 rounded-t-[2rem] md:rounded-t-[3rem] shadow-2xl">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {stats.map((stat, idx) => (
              <div key={idx} className="flex flex-col items-center text-center p-6 sm:p-10 bg-background border rounded-[2rem] sm:rounded-[3rem] shadow-sm hover:shadow-2xl transition-all group hover:-translate-y-2">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary/10 rounded-2xl sm:rounded-[2rem] flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                  <stat.icon className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
                </div>
                <div className="text-4xl md:text-6xl font-headline font-bold text-primary mb-2 tracking-tighter">{stat.value}</div>
                <div className="text-xs sm:text-sm md:text-lg text-muted-foreground font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-primary py-16 md:py-24 text-white relative overflow-hidden">
        <div className="container mx-auto px-4 flex flex-col items-center text-center space-y-8 relative z-10">
          <h2 className="text-3xl md:text-6xl font-headline font-bold max-w-4xl">
            {t.home.ctaTitle}
          </h2>
          <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl leading-relaxed">
            {t.home.ctaSubtitle}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 w-full sm:w-auto">
            <Link href="/donate" className="w-full sm:w-auto">
              <Button size="lg" className="w-full bg-secondary hover:bg-secondary/90 text-white px-10 h-16 text-xl font-bold rounded-full shadow-xl">
                {t.home.btnDonate}
              </Button>
            </Link>
            <Link href="/contact" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full border-white text-white hover:bg-white/10 px-10 h-16 text-xl font-bold rounded-full">
                {t.home.ctaContact}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
