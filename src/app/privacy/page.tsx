'use client';

import * as React from "react";
import { useFirestore, useDoc } from "@/firebase";
import { doc } from "firebase/firestore";

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

/** Renders a block of admin-editable text as one <p> per blank-line-separated paragraph. */
function ParagraphText({ text }: { text: string }) {
  const paragraphs = text.split(/\n{2,}/).filter((p) => p.trim().length > 0);
  return (
    <>
      {paragraphs.map((paragraph, i) => (
        <p key={i}>
          {paragraph.split('\n').map((line, j, arr) => (
            <React.Fragment key={j}>
              {line}
              {j < arr.length - 1 && <br />}
            </React.Fragment>
          ))}
        </p>
      ))}
    </>
  );
}

export default function PrivacyPage() {
  const db = useFirestore();

  const settingsRef = React.useMemo(() => {
    if (!db) return null;
    return doc(db, "site_settings", "general");
  }, [db]);
  const { data: settings } = useDoc(settingsRef);

  const privacyRef = React.useMemo(() => {
    if (!db) return null;
    return doc(db, "site_content", "privacy");
  }, [db]);
  const { data: privacyContent } = useDoc(privacyRef);

  const orgName = settings?.orgName || "FFG-VE Horizon e.V.";
  const address = settings?.contactAddress || "[Straße, Hausnummer, PLZ, Ort]";
  const email = settings?.contactEmail || "contact@ffg-ve.org";

  const content = {
    general: privacyContent?.general || DEFAULTS.general,
    hosting: privacyContent?.hosting || DEFAULTS.hosting,
    forms: privacyContent?.forms || DEFAULTS.forms,
    firebase: privacyContent?.firebase || DEFAULTS.firebase,
    images: privacyContent?.images || DEFAULTS.images,
    rights: privacyContent?.rights || DEFAULTS.rights,
    changes: privacyContent?.changes || DEFAULTS.changes,
  };

  return (
    <div className="container mx-auto px-4 py-20 max-w-3xl">
      <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary mb-10">Datenschutzerklärung</h1>

      <div className="prose dark:prose-invert max-w-none space-y-8">
        <section>
          <h2>1. Verantwortlicher</h2>
          <p>
            Verantwortlicher im Sinne der Datenschutz-Grundverordnung (DSGVO) ist:
            <br />
            {orgName}, {address}, Deutschland
            <br />
            E-Mail: {email}
          </p>
        </section>

        <section>
          <h2>2. Allgemeines zur Datenverarbeitung</h2>
          <ParagraphText text={content.general} />
        </section>

        <section>
          <h2>3. Hosting und Server-Logfiles</h2>
          <ParagraphText text={content.hosting} />
        </section>

        <section>
          <h2>4. Kontakt-, Spenden- und Bewerbungsformulare</h2>
          <ParagraphText text={content.forms} />
        </section>

        <section>
          <h2>5. Datenspeicherung (Firebase)</h2>
          <ParagraphText text={content.firebase} />
        </section>

        <section>
          <h2>6. Bildmaterial (Cloudinary)</h2>
          <ParagraphText text={content.images} />
        </section>

        <section>
          <h2>7. Ihre Rechte</h2>
          <ParagraphText text={content.rights} />
          <p>
            Zur Ausübung dieser Rechte genügt eine formlose Mitteilung per E-Mail an: {email}.
          </p>
        </section>

        <section>
          <h2>8. Änderung dieser Datenschutzerklärung</h2>
          <ParagraphText text={content.changes} />
        </section>
      </div>
    </div>
  );
}
