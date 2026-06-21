
'use client';

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Heart, Users, Globe, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useFirestore, useDoc } from "@/firebase";
import { doc } from "firebase/firestore";

export default function Home() {
  const db = useFirestore();
  const settingsRef = React.useMemo(() => {
    if (!db) return null;
    return doc(db, "site_settings", "general");
  }, [db]);

  const { data: settings, loading } = useDoc(settingsRef);

  const stats = [
    { label: "Bénéficiaires", value: "2.5M+", icon: Heart },
    { label: "Pays d'intervention", value: "35", icon: Globe },
    { label: "Projets réalisés", value: "1,200+", icon: CheckCircle2 },
    { label: "Bénévoles actifs", value: "15,000+", icon: Users },
  ];

  const programs = [
    {
      title: "Éducation",
      desc: "Construire des écoles et fournir du matériel pour l'avenir des enfants.",
      img: PlaceHolderImages.find(i => i.id === "program-education")?.imageUrl,
      link: "/programs#education"
    },
    {
      title: "Santé",
      desc: "Soins médicaux d'urgence et accès à la vaccination pour tous.",
      img: PlaceHolderImages.find(i => i.id === "program-health")?.imageUrl,
      link: "/programs#sante"
    },
    {
      title: "Eau & Assainissement",
      desc: "Accès à l'eau potable pour réduire les maladies hydriques.",
      img: PlaceHolderImages.find(i => i.id === "program-water")?.imageUrl,
      link: "/programs#eau"
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  const heroImage = settings?.heroImageUrl || PlaceHolderImages.find(i => i.id === "hero-humanitarian")?.imageUrl || "";
  const slogan = settings?.slogan || "Ensemble pour un monde plus solidaire";

  return (
    <div className="flex flex-col gap-0 animate-in fade-in duration-700">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden py-20 md:py-0">
        <div className="absolute inset-0">
          <Image
            src={heroImage}
            alt="Humanitarian Hero"
            fill
            className="object-cover brightness-[0.4]"
            priority
            data-ai-hint="humanitarian aid"
          />
        </div>
        <div className="container relative mx-auto px-4 z-10 text-white space-y-8 max-w-4xl">
          <div className="inline-block px-4 py-1 rounded-full bg-secondary/80 backdrop-blur-sm text-xs md:text-sm font-bold tracking-wider uppercase mb-4">
            {slogan}
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-headline font-bold leading-tight">
            Changeons des vies, <br className="hidden sm:block" />
            <span className="text-secondary">bâtissons l'avenir.</span>
          </h1>
          <p className="text-lg md:text-2xl text-white/90 leading-relaxed max-w-2xl">
            FFG-VE est aux premières lignes de l'action humanitaire, apportant espoir et dignité aux communautés les plus vulnérables du monde entier.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link href="/donate" className="w-full sm:w-auto">
              <Button size="lg" className="w-full bg-secondary hover:bg-secondary/90 text-white text-lg font-bold px-8 h-14 shadow-xl rounded-full">
                Faire un don
              </Button>
            </Link>
            <Link href="/volunteer" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full bg-white/10 hover:bg-white/20 border-white/40 text-white text-lg font-bold px-8 h-14 backdrop-blur-sm rounded-full">
                Devenir bénévole
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white dark:bg-zinc-900 py-12 md:py-20 -mt-10 relative z-20 rounded-t-[2rem] md:rounded-t-[3rem] shadow-2xl">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="flex flex-col items-center text-center p-6 bg-background border rounded-2xl shadow-sm hover:shadow-md transition-shadow group">
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <stat.icon className="h-7 w-7 text-primary" />
                </div>
                <div className="text-3xl md:text-4xl font-headline font-bold text-primary mb-1">{stat.value}</div>
                <div className="text-sm md:text-base text-muted-foreground font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Programs */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-12 md:mb-16 gap-6 text-center md:text-left">
            <div className="max-w-2xl space-y-4">
              <h2 className="text-primary font-bold tracking-wide uppercase text-sm">Nos Actions Prioritaires</h2>
              <p className="text-3xl md:text-5xl font-headline font-bold leading-tight">
                Intervenir là où le besoin est le plus <span className="text-secondary italic">urgent</span>.
              </p>
            </div>
            <Link href="/programs">
              <Button variant="outline" className="group rounded-full">
                Tous nos programmes <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {programs.map((prog, idx) => (
              <Card key={idx} className="overflow-hidden border-none shadow-lg hover:shadow-2xl transition-all duration-300 rounded-3xl group">
                <div className="relative h-56 md:h-64">
                  <Image
                    src={prog.img || ""}
                    alt={prog.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute bottom-6 left-6 text-white">
                    <h3 className="text-xl md:text-2xl font-headline font-bold mb-1">{prog.title}</h3>
                  </div>
                </div>
                <CardContent className="p-6 md:p-8 space-y-4 bg-white dark:bg-zinc-950">
                  <p className="text-muted-foreground text-sm md:text-base line-clamp-3 leading-relaxed">
                    {prog.desc}
                  </p>
                  <Link href={prog.link} className="inline-flex items-center text-primary font-bold hover:underline">
                    En savoir plus <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Urgent Call to Action */}
      <section className="bg-primary py-16 md:py-24 text-white relative overflow-hidden">
        <div className="container mx-auto px-4 flex flex-col items-center text-center space-y-8 relative z-10">
          <h2 className="text-3xl md:text-6xl font-headline font-bold max-w-4xl">
            Prêt à faire une différence aujourd'hui ?
          </h2>
          <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl leading-relaxed">
            Votre soutien financier permet de sauver des vies. Chaque don, petit ou grand, a un impact réel et mesurable sur le terrain.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 w-full sm:w-auto">
            <Link href="/donate" className="w-full sm:w-auto">
              <Button size="lg" className="w-full bg-secondary hover:bg-secondary/90 text-white px-10 h-16 text-xl font-bold rounded-full shadow-xl">
                Soutenir nos actions
              </Button>
            </Link>
            <Link href="/contact" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full border-white text-white hover:bg-white/10 px-10 h-16 text-xl font-bold rounded-full">
                Nous contacter
              </Button>
            </Link>
          </div>
        </div>
        <div className="absolute -top-24 -left-24 w-64 h-64 md:w-96 md:h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-64 h-64 md:w-96 md:h-96 bg-secondary/10 rounded-full blur-3xl" />
      </section>
    </div>
  );
}
