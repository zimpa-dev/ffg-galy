'use client';

import * as React from "react";
import Link from "next/link";
import { Droplets, Stethoscope, Zap, Sparkles, ArrowRight, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useFirestore, useDoc } from "@/firebase";
import { doc } from "firebase/firestore";

const DEFAULTS = {
  title: "Willkommen bei „Freunde für Galy e.V.“: Gemeinsam für die Entwicklung des Stadtteils Galy in Mombeyah",
  intro:
    "Der Verein „Freunde für Galy“, gegründet am 12. Mai 2018 und mit Sitz in Hannover (30159 Hannover), engagiert sich aktiv in der Entwicklungszusammenarbeit. Seine Hauptaufgabe besteht darin, finanzielle Mittel zu sammeln und gezielt zur direkten Unterstützung der Bewohnerinnen und Bewohner des Stadtteils Galy in der Stadt Mombeyah in Guinea einzusetzen. Der Verein verfolgt seine Ziele uneigennützig und gemeinnützig, in strikter politischer Neutralität sowie in Offenheit gegenüber allen religiösen und weltanschaulichen Überzeugungen.",
  focusTitle: "Unsere Schwerpunkte in Galy",
  focusIntro:
    "Um die Lebensbedingungen der Bevölkerung nachhaltig zu verbessern, beteiligt sich der Verein an der Finanzierung, dem Bau und der Ausstattung wichtiger Projekte:",
  focus1Title: "Landwirtschaft und Zugang zu Wasser",
  focus1Desc:
    "Wir unterstützen die Bereitstellung landwirtschaftlicher Geräte, den Bau von Bewässerungssystemen sowie die Schaffung von Infrastrukturen für die Trinkwasserversorgung.",
  focus2Title: "Gesundheit und Bildung",
  focus2Desc:
    "Unsere Maßnahmen unterstützen den Betrieb von Schulen und Krankenhäusern sowie Projekte zur Gesundheitsaufklärung, Prävention und medizinischen Versorgung.",
  focus3Title: "Infrastruktur und Energie",
  focus3Desc:
    "Der Verein trägt zur Entwicklung des Verkehrs, zum Aufbau von Gemeinschaftszentren und zur Schaffung von Anlagen zur eigenständigen Energieversorgung bei.",
  activitiesTitle: "Aktivitäten vor Ort und Veranstaltungen",
  activitiesText:
    "Neben diesen Infrastrukturprojekten führt der Verein auch direkte Maßnahmen vor Ort in Galy durch, insbesondere die Verteilung von Kleidung. Um die Bevölkerung über unsere Aktivitäten zu informieren und die für diese Maßnahmen notwendigen Spenden zu sammeln, organisieren wir Begegnungstage sowie ein jährliches Kulturfestival.\n\nJede volljährige natürliche Person kann einen Antrag auf Mitgliedschaft stellen und damit unsere Ziele unterstützen. Gemeinsam können wir den Bewohnerinnen und Bewohnern von Galy konkrete und nachhaltige Unterstützung bieten!",
  callout:
    "Möchten Sie mehr erfahren? Auf unserer Website finden Sie weitere Informationen über den Ablauf der Mitgliedschaft sowie über die Aufgaben und Verantwortlichkeiten des Vorstands.",
};

function Paragraphs({ text, className }: { text: string; className?: string }) {
  const paragraphs = text.split(/\n{2,}/).filter((p) => p.trim().length > 0);
  return (
    <>
      {paragraphs.map((p, i) => (
        <p key={i} className={className}>
          {p}
        </p>
      ))}
    </>
  );
}

export default function BlogPage() {
  const db = useFirestore();
  const blogRef = React.useMemo(() => {
    if (!db) return null;
    return doc(db, "site_content", "blog");
  }, [db]);
  const { data, loading } = useDoc(blogRef);

  const c = {
    title: data?.title || DEFAULTS.title,
    intro: data?.intro || DEFAULTS.intro,
    focusTitle: data?.focusTitle || DEFAULTS.focusTitle,
    focusIntro: data?.focusIntro || DEFAULTS.focusIntro,
    focus1Title: data?.focus1Title || DEFAULTS.focus1Title,
    focus1Desc: data?.focus1Desc || DEFAULTS.focus1Desc,
    focus2Title: data?.focus2Title || DEFAULTS.focus2Title,
    focus2Desc: data?.focus2Desc || DEFAULTS.focus2Desc,
    focus3Title: data?.focus3Title || DEFAULTS.focus3Title,
    focus3Desc: data?.focus3Desc || DEFAULTS.focus3Desc,
    activitiesTitle: data?.activitiesTitle || DEFAULTS.activitiesTitle,
    activitiesText: data?.activitiesText || DEFAULTS.activitiesText,
    callout: data?.callout || DEFAULTS.callout,
  };

  const focusItems = [
    { icon: Droplets, title: c.focus1Title, desc: c.focus1Desc },
    { icon: Stethoscope, title: c.focus2Title, desc: c.focus2Desc },
    { icon: Zap, title: c.focus3Title, desc: c.focus3Desc },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <article className="min-h-screen pb-24 animate-in fade-in duration-700">
      <div className="bg-primary text-white py-20 md:py-28">
        <div className="container mx-auto px-4 max-w-4xl text-center space-y-6">
          <h1 className="text-3xl md:text-5xl font-headline font-bold leading-tight">{c.title}</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-4xl -mt-10 relative z-10">
        <Card className="border-none shadow-xl rounded-[2rem] overflow-hidden">
          <CardContent className="p-6 sm:p-10 md:p-14 space-y-14">
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p className="text-lg md:text-xl font-medium text-primary leading-relaxed italic border-l-4 border-primary pl-6">
                {c.intro}
              </p>
            </div>

            <div className="space-y-8">
              <div className="space-y-3">
                <h2 className="text-2xl md:text-3xl font-headline font-bold">{c.focusTitle}</h2>
                <p className="text-muted-foreground leading-relaxed">{c.focusIntro}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {focusItems.map((item, i) => (
                  <div
                    key={i}
                    className="p-6 rounded-2xl bg-muted/40 border space-y-4 hover:shadow-md transition-shadow"
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      <item.icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-headline font-bold text-lg">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-headline font-bold">{c.activitiesTitle}</h2>
              <div className="prose prose-lg dark:prose-invert max-w-none prose-p:leading-relaxed prose-p:text-muted-foreground">
                <Paragraphs text={c.activitiesText} />
              </div>
            </div>

            <div className="p-8 rounded-2xl bg-secondary/10 border border-secondary/20 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Sparkles className="h-8 w-8 text-secondary flex-shrink-0" />
              <p className="text-sm md:text-base font-medium">{c.callout}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/volunteer" className="flex-1">
                <Button className="w-full h-12 rounded-xl font-bold">
                  Mitglied werden <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/donate" className="flex-1">
                <Button variant="outline" className="w-full h-12 rounded-xl font-bold">
                  Jetzt spenden
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </article>
  );
}
