
'use client';

import * as React from "react";
import { useFirestore, useDoc } from "@/firebase";
import { doc, setDoc } from "firebase/firestore";
import { FileText, Save, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

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

export default function AdminBlogPage() {
  const db = useFirestore();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = React.useState(false);

  const blogRef = React.useMemo(() => {
    if (!db) return null;
    return doc(db, "site_content", "blog");
  }, [db]);

  const { data: blogData, loading } = useDoc(blogRef);

  const [formData, setFormData] = React.useState({ ...DEFAULTS });

  React.useEffect(() => {
    if (blogData) {
      setFormData({
        title: blogData.title || DEFAULTS.title,
        intro: blogData.intro || DEFAULTS.intro,
        focusTitle: blogData.focusTitle || DEFAULTS.focusTitle,
        focusIntro: blogData.focusIntro || DEFAULTS.focusIntro,
        focus1Title: blogData.focus1Title || DEFAULTS.focus1Title,
        focus1Desc: blogData.focus1Desc || DEFAULTS.focus1Desc,
        focus2Title: blogData.focus2Title || DEFAULTS.focus2Title,
        focus2Desc: blogData.focus2Desc || DEFAULTS.focus2Desc,
        focus3Title: blogData.focus3Title || DEFAULTS.focus3Title,
        focus3Desc: blogData.focus3Desc || DEFAULTS.focus3Desc,
        activitiesTitle: blogData.activitiesTitle || DEFAULTS.activitiesTitle,
        activitiesText: blogData.activitiesText || DEFAULTS.activitiesText,
        callout: blogData.callout || DEFAULTS.callout,
      });
    }
  }, [blogData]);

  const handleSave = async () => {
    if (!db) return;
    setIsSaving(true);
    try {
      await setDoc(
        doc(db, "site_content", "blog"),
        { ...formData, updatedAt: new Date().toISOString() },
        { merge: true }
      );
      toast({
        title: "Page Blog mise à jour",
        description: "Le contenu de la page /blog a été actualisé avec succès.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de sauvegarder les modifications.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold">Page Blog</h1>
          <p className="text-muted-foreground text-sm">Gérez le contenu affiché sur la page publique /blog.</p>
        </div>
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-primary hover:bg-primary/90 rounded-xl px-8 h-12 font-bold shadow-lg gap-2"
        >
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Sauvegarder
        </Button>
      </div>

      <Card className="border-none shadow-xl rounded-2xl overflow-hidden">
        <CardHeader>
          <div className="flex items-center gap-2 text-primary">
            <FileText className="h-5 w-5" />
            <CardTitle>Introduction</CardTitle>
          </div>
          <CardDescription>Titre principal et paragraphe d'introduction affichés en haut de la page.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label className="font-bold">Titre</Label>
            <Textarea
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="rounded-xl min-h-[80px]"
            />
          </div>
          <div className="space-y-2">
            <Label className="font-bold">Paragraphe d'introduction</Label>
            <Textarea
              value={formData.intro}
              onChange={(e) => setFormData({ ...formData, intro: e.target.value })}
              className="rounded-xl min-h-[140px]"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-xl rounded-2xl overflow-hidden">
        <CardHeader>
          <CardTitle>Nos priorités à Galy</CardTitle>
          <CardDescription>Le titre de section, l'accroche, et les 3 domaines d'action.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Titre de section</Label>
              <Input
                value={formData.focusTitle}
                onChange={(e) => setFormData({ ...formData, focusTitle: e.target.value })}
                className="rounded-xl h-11"
              />
            </div>
            <div className="space-y-2">
              <Label>Accroche</Label>
              <Input
                value={formData.focusIntro}
                onChange={(e) => setFormData({ ...formData, focusIntro: e.target.value })}
                className="rounded-xl h-11"
              />
            </div>
          </div>

          <Separator />

          {[1, 2, 3].map((n) => {
            const titleKey = `focus${n}Title` as keyof typeof formData;
            const descKey = `focus${n}Desc` as keyof typeof formData;
            return (
              <div key={n} className="space-y-3 p-4 rounded-xl bg-muted/30 border">
                <div className="space-y-2">
                  <Label className="font-bold">Domaine {n} — Titre</Label>
                  <Input
                    value={formData[titleKey]}
                    onChange={(e) => setFormData({ ...formData, [titleKey]: e.target.value })}
                    className="rounded-xl h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Domaine {n} — Description</Label>
                  <Textarea
                    value={formData[descKey]}
                    onChange={(e) => setFormData({ ...formData, [descKey]: e.target.value })}
                    className="rounded-xl min-h-[90px]"
                  />
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card className="border-none shadow-xl rounded-2xl overflow-hidden">
        <CardHeader>
          <CardTitle>Activités et adhésion</CardTitle>
          <CardDescription>
            Séparez les paragraphes par une ligne vide. Le texte de mise en avant (💡) s'affiche dans un
            encadré en bas de page.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label className="font-bold">Titre de section</Label>
            <Input
              value={formData.activitiesTitle}
              onChange={(e) => setFormData({ ...formData, activitiesTitle: e.target.value })}
              className="rounded-xl h-11"
            />
          </div>
          <div className="space-y-2">
            <Label className="font-bold">Texte</Label>
            <Textarea
              value={formData.activitiesText}
              onChange={(e) => setFormData({ ...formData, activitiesText: e.target.value })}
              className="rounded-xl min-h-[160px]"
            />
          </div>
          <div className="space-y-2">
            <Label className="font-bold">Encadré de mise en avant</Label>
            <Textarea
              value={formData.callout}
              onChange={(e) => setFormData({ ...formData, callout: e.target.value })}
              className="rounded-xl min-h-[90px]"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
