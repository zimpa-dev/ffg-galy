
'use client';

import * as React from "react";
import { useFirestore, useDoc } from "@/firebase";
import { doc, setDoc } from "firebase/firestore";
import { ShieldCheck, Save, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const DEFAULTS = {
  general:
    "Wir verarbeiten personenbezogene Daten unserer Nutzer grundsätzlich nur, soweit dies zur Bereitstellung einer funktionsfähigen Website sowie unserer Inhalte und Leistungen erforderlich ist, oder soweit gesetzliche Vorschriften dies gestatten.",
  hosting:
    "Diese Website wird bei einem externen Hosting-Anbieter gehostet. Personenbezogene Daten, die auf dieser Website erfasst werden, werden auf dessen Servern gespeichert. Bei jedem Aufruf unserer Website erfasst unser System automatisiert Daten und Informationen (z. B. IP-Adresse, Datum und Uhrzeit, aufgerufene Seite, verwendeter Browser).",
  forms:
    "Wenn Sie uns über das Kontaktformular, das Spendenformular oder das Bewerbungsformular für Freiwillige Angaben zukommen lassen, werden Ihre Angaben zwecks Bearbeitung der Anfrage sowie für den Fall von Anschlussfragen bei uns gespeichert. Diese Daten geben wir nicht ohne Ihre Einwilligung weiter. Die Verarbeitung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO, sofern Ihre Anfrage mit der Erfüllung eines Vertrags zusammenhängt oder zur Durchführung vorvertraglicher Maßnahmen erforderlich ist. In allen übrigen Fällen beruht die Verarbeitung auf unserem berechtigten Interesse an der effektiven Bearbeitung von Anfragen (Art. 6 Abs. 1 lit. f DSGVO) oder auf Ihrer Einwilligung (Art. 6 Abs. 1 lit. a DSGVO), sofern diese abgefragt wurde.\n\nDie für den Versand von Benachrichtigungs- und Bestätigungs-E-Mails eingesetzte E-Mail-Infrastruktur wird über einen externen Dienstleister betrieben.",
  firebase:
    "Zur Speicherung von Inhalten (Aktuelles, Programme, Galerie) sowie von Bewerbungs- und Spendendaten nutzen wir die Firebase-Dienste von Google Ireland Limited. Zugriffsrechte auf sensible Daten (Bewerbungen, Spenden) sind auf autorisierte Administratoren beschränkt.",
  images:
    "Für die Bereitstellung von Bildern auf dieser Website nutzen wir den Dienst Cloudinary. Beim Laden von Bildern kann eine Verbindung zu Servern des Anbieters hergestellt werden.",
  rights:
    "Sie haben jederzeit das Recht auf Auskunft, Berichtigung, Löschung oder Einschränkung der Verarbeitung Ihrer gespeicherten personenbezogenen Daten, ein Widerspruchsrecht gegen die Verarbeitung sowie ein Recht auf Datenübertragbarkeit. Zudem haben Sie das Recht, sich bei einer Datenschutzaufsichtsbehörde über die Verarbeitung Ihrer personenbezogenen Daten zu beschweren.",
  changes:
    "Wir behalten uns vor, diese Datenschutzerklärung anzupassen, damit sie stets den aktuellen rechtlichen Anforderungen entspricht oder um Änderungen unserer Leistungen umzusetzen.",
};

const SECTIONS: Array<{ key: keyof typeof DEFAULTS; number: string; title: string }> = [
  { key: "general", number: "2.", title: "Allgemeines zur Datenverarbeitung" },
  { key: "hosting", number: "3.", title: "Hosting und Server-Logfiles" },
  { key: "forms", number: "4.", title: "Kontakt-, Spenden- und Bewerbungsformulare" },
  { key: "firebase", number: "5.", title: "Datenspeicherung (Firebase)" },
  { key: "images", number: "6.", title: "Bildmaterial (Cloudinary)" },
  { key: "rights", number: "7.", title: "Ihre Rechte" },
  { key: "changes", number: "8.", title: "Änderung dieser Datenschutzerklärung" },
];

export default function AdminPrivacyPage() {
  const db = useFirestore();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = React.useState(false);

  const privacyRef = React.useMemo(() => {
    if (!db) return null;
    return doc(db, "site_content", "privacy");
  }, [db]);

  const { data: privacyData, loading } = useDoc(privacyRef);

  const [formData, setFormData] = React.useState({ ...DEFAULTS });

  React.useEffect(() => {
    if (privacyData) {
      setFormData({
        general: privacyData.general || DEFAULTS.general,
        hosting: privacyData.hosting || DEFAULTS.hosting,
        forms: privacyData.forms || DEFAULTS.forms,
        firebase: privacyData.firebase || DEFAULTS.firebase,
        images: privacyData.images || DEFAULTS.images,
        rights: privacyData.rights || DEFAULTS.rights,
        changes: privacyData.changes || DEFAULTS.changes,
      });
    }
  }, [privacyData]);

  const handleSave = async () => {
    if (!db) return;
    setIsSaving(true);
    try {
      await setDoc(
        doc(db, "site_content", "privacy"),
        { ...formData, updatedAt: new Date().toISOString() },
        { merge: true }
      );
      toast({
        title: "Politique de confidentialité mise à jour",
        description: "Les sections 2 à 8 de la page Datenschutz ont été actualisées.",
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
          <h1 className="text-3xl font-headline font-bold">Politique de confidentialité</h1>
          <p className="text-muted-foreground text-sm">
            Modifiez le texte des sections 2 à 8 de la page publique Datenschutz. La section 1
            (Verantwortlicher) se gère dans Paramètres → Organisation.
          </p>
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
            <ShieldCheck className="h-5 w-5" />
            <CardTitle>Datenschutzerklärung</CardTitle>
          </div>
          <CardDescription>
            Chaque section correspond à un bloc affiché sur /privacy. Laissez un vide pour revenir au
            texte par défaut.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {SECTIONS.map((section) => (
            <div key={section.key} className="space-y-2">
              <Label className="font-bold">
                {section.number} {section.title}
              </Label>
              <Textarea
                value={formData[section.key]}
                onChange={(e) => setFormData({ ...formData, [section.key]: e.target.value })}
                className="rounded-xl min-h-[120px]"
              />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
