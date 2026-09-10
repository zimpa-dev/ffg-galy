'use client';

import * as React from "react";
import Image from "next/image"
import Link from "next/link"
import { Shield, Target, Eye, Users2, Heart, Facebook, Twitter, Linkedin, Loader2 } from "lucide-react"
import { PlaceHolderImages } from "@/lib/placeholder-images"
import { Card, CardContent } from "@/components/ui/card"
import { useFirestore, useDoc } from "@/firebase"
import { doc } from "firebase/firestore"

export default function AboutPage() {
  const db = useFirestore();
  const aboutDocRef = React.useMemo(() => {
    if (!db) return null;
    return doc(db, "site_content", "about");
  }, [db]);

  const { data: aboutData, loading } = useDoc(aboutDocRef);

  const values = [
    { title: "Solidarité", desc: "Nous croyons en la force du collectif pour surmonter les défis.", icon: Heart },
    { title: "Transparence", desc: "Une gestion rigoureuse et des comptes ouverts à tous.", icon: Shield },
    { title: "Intégrité", desc: "Nos actions reflètent nos paroles, partout dans le monde.", icon: Target },
    { title: "Inclusion", desc: "Aider sans distinction de race, de religion ou de genre.", icon: Users2 },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  const defaultTeam = [
    { id: "1", name: "Dr. Amadou Diallo", role: "Président Fondateur", img: PlaceHolderImages.find(i => i.id === "team-leader")?.imageUrl },
    { id: "2", name: "Marie Dubois", role: "Directrice des Programmes", img: "https://picsum.photos/seed/team2/400/400" },
    { id: "3", name: "Sven Müller", role: "Trésorier", img: "https://picsum.photos/seed/team3/400/400" },
    { id: "4", name: "Fatima Al-Sayed", role: "Responsable Logistique", img: "https://picsum.photos/seed/team4/400/400" },
  ]

  const content = aboutData || {
    heroTitle: "Notre Engagement",
    heroSubtitle: "Fondée en 2005, FFG-VE est née d'une vision simple : aucune souffrance ne devrait rester sans réponse.",
    history: "Aujourd'hui, nous sommes une force de changement dans plus de 35 pays. Nous agissons sur le terrain avec les communautés locales pour garantir la pérennité de chaque projet.",
    mission: "Mobiliser les ressources pour répondre aux urgences humanitaires et accompagner les populations vers l'autonomie.",
    vision: "Un monde où chaque individu a accès aux droits fondamentaux : éducation, santé et environnement durable.",
    teamIntro: "Des professionnels passionnés engagés pour la cause humanitaire.",
    teamMembers: defaultTeam
  };

  const teamMembers = content.teamMembers || defaultTeam;
  const historyImage = PlaceHolderImages.find(i => i.id === "project-gallery-1")?.imageUrl || "https://picsum.photos/seed/impact/800/1000";

  return (
    <div className="flex flex-col gap-0 animate-in fade-in duration-700">
      {/* Hero Section */}
      <section className="bg-primary py-20 md:py-32 text-white relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10 max-w-4xl space-y-6">
          <div className="inline-block px-4 py-1 bg-white/10 rounded-full text-xs font-bold tracking-widest uppercase mb-4">
            À propos de FFG-VE
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-headline font-bold leading-tight">{content.heroTitle}</h1>
          <p className="text-lg sm:text-xl md:text-2xl text-primary-foreground/80 leading-relaxed font-medium">
            {content.heroSubtitle}
          </p>
        </div>
        <div className="absolute top-0 right-0 w-1/3 h-full bg-white/5 skew-x-12 translate-x-20" />
      </section>

      {/* Narrative Section */}
      <section className="py-16 md:py-24 bg-white dark:bg-zinc-950">
        <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <div className="lg:col-span-7 space-y-6 md:space-y-8">
            <h2 className="text-3xl sm:text-4xl font-headline font-bold">Une Histoire de Solidarité</h2>
            <div className="prose dark:prose-invert max-w-none text-base sm:text-lg text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {content.history}
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500 bg-zinc-100">
              {historyImage && (
                <Image 
                  src={historyImage} 
                  alt="Impact FFG-VE" 
                  fill 
                  className="object-cover"
                />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Grid */}
      <section className="py-16 md:py-24 bg-zinc-50 dark:bg-zinc-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <div className="bg-white dark:bg-zinc-800 p-8 sm:p-12 rounded-[2rem] sm:rounded-[3rem] shadow-xl space-y-6 md:space-y-8 relative overflow-hidden group">
              <div className="bg-primary/10 p-4 sm:p-5 inline-block rounded-2xl relative z-10">
                <Target className="h-9 w-9 sm:h-10 sm:w-10 text-primary" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-headline font-bold relative z-10">Notre Mission</h2>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed relative z-10">
                {content.mission}
              </p>
            </div>
            <div className="bg-white dark:bg-zinc-800 p-8 sm:p-12 rounded-[2rem] sm:rounded-[3rem] shadow-xl space-y-6 md:space-y-8 relative overflow-hidden group">
              <div className="bg-secondary/10 p-4 sm:p-5 inline-block rounded-2xl relative z-10">
                <Eye className="h-9 w-9 sm:h-10 sm:w-10 text-secondary" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-headline font-bold relative z-10">Notre Vision</h2>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed relative z-10">
                {content.vision}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl font-headline font-bold text-center mb-10 md:mb-16">Nos Valeurs Fondamentales</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v, i) => (
              <Card key={i} className="border-none shadow-md hover:shadow-xl transition-all hover:-translate-y-2 rounded-3xl">
                <CardContent className="p-8 space-y-4 flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mb-2">
                    <v.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">{v.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{v.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 md:py-24 bg-zinc-50 dark:bg-zinc-950">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-10 md:mb-16 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-headline font-bold">L'Équipe Dirigeante</h2>
            <p className="text-muted-foreground text-base sm:text-lg">{content.teamIntro}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
            {teamMembers.map((m: any) => (
              <div key={m.id} className="space-y-4 text-center group">
                <div className="relative aspect-square rounded-[3rem] overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-300 bg-zinc-100">
                  {m.img && (
                    <Image 
                      src={m.img} 
                      alt={m.name} 
                      fill 
                      className="object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                  )}
                  <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    {m.facebook && (
                      <Link href={m.facebook} target="_blank" className="bg-white p-2 rounded-full text-blue-600 hover:scale-110 transition-transform">
                        <Facebook className="h-5 w-5" />
                      </Link>
                    )}
                    {m.twitter && (
                      <Link href={m.twitter} target="_blank" className="bg-white p-2 rounded-full text-sky-400 hover:scale-110 transition-transform">
                        <Twitter className="h-5 w-5" />
                      </Link>
                    )}
                    {m.linkedin && (
                      <Link href={m.linkedin} target="_blank" className="bg-white p-2 rounded-full text-blue-800 hover:scale-110 transition-transform">
                        <Linkedin className="h-5 w-5" />
                      </Link>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold">{m.name}</h3>
                  <p className="text-primary font-bold text-sm tracking-widest uppercase">{m.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
