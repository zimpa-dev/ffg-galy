'use client';

import * as React from "react";
import { useFirestore, useDoc } from "@/firebase";
import { doc } from "firebase/firestore";

export default function LegalPage() {
  const db = useFirestore();
  const settingsRef = React.useMemo(() => {
    if (!db) return null;
    return doc(db, "site_settings", "general");
  }, [db]);
  const { data: settings } = useDoc(settingsRef);

  const orgName = settings?.orgName || "FFG-VE Horizon e.V.";
  const address = settings?.contactAddress || "[Straße, Hausnummer, PLZ, Ort]";
  const phone = settings?.contactPhone || "[Telefonnummer]";
  const email = settings?.contactEmail || "contact@ffg-ve.org";
  const representative = settings?.legalRepresentative || "[Name des/der Vorstandsvorsitzenden]";
  const registerCourt = settings?.registerCourt || "[Amtsgericht]";
  const registerNumber = settings?.registerNumber || "[VR-Nummer]";
  const vatId = settings?.vatId || "[USt-IdNr.]";

  return (
    <div className="container mx-auto px-4 py-20 max-w-3xl">
      <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary mb-10">Impressum</h1>

      <div className="prose dark:prose-invert max-w-none space-y-8">
        <section>
          <h2>Angaben gemäß § 5 TMG</h2>
          <p>
            {orgName}
            <br />
            {address}
            <br />
            Deutschland
          </p>
        </section>

        <section>
          <h2>Vertreten durch</h2>
          <p>{representative}</p>
        </section>

        <section>
          <h2>Kontakt</h2>
          <p>
            Telefon: {phone}
            <br />
            E-Mail: {email}
          </p>
        </section>

        <section>
          <h2>Registereintrag</h2>
          <p>
            Eintragung im Vereinsregister.
            <br />
            Registergericht: {registerCourt}
            <br />
            Registernummer: {registerNumber}
          </p>
        </section>

        <section>
          <h2>Umsatzsteuer-ID</h2>
          <p>Umsatzsteuer-Identifikationsnummer gemäß § 27a Umsatzsteuergesetz: {vatId}</p>
        </section>

        <section>
          <h2>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
          <p>
            {representative}
            <br />
            {address}
          </p>
        </section>

        <section>
          <h2>EU-Streitschlichtung</h2>
          <p>
            Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{' '}
            <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer">
              https://ec.europa.eu/consumers/odr/
            </a>
            . Wir sind nicht verpflichtet und nicht bereit, an Streitbeilegungsverfahren vor einer
            Verbraucherschlichtungsstelle teilzunehmen.
          </p>
        </section>

        <section>
          <h2>Haftung für Inhalte</h2>
          <p>
            Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen Seiten nach den
            allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch
            nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach
            Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
          </p>
        </section>

        <section>
          <h2>Haftung für Links</h2>
          <p>
            Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss
            haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen.
          </p>
        </section>

        <section>
          <h2>Urheberrecht</h2>
          <p>
            Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem
            deutschen Urheberrecht. Beiträge Dritter sind als solche gekennzeichnet.
          </p>
        </section>
      </div>
    </div>
  );
}
