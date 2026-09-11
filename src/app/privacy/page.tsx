import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Datenschutz',
  description: 'Datenschutzerklärung von FFG-VE Horizon gemäß Art. 13 DSGVO.',
  alternates: { canonical: '/privacy' },
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-20 max-w-3xl">
      <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary mb-10">Datenschutzerklärung</h1>

      <div className="prose dark:prose-invert max-w-none space-y-8">
        <section>
          <h2>1. Verantwortlicher</h2>
          <p>
            Verantwortlicher im Sinne der Datenschutz-Grundverordnung (DSGVO) ist:
            <br />
            FFG-VE Horizon e.V., [Straße und Hausnummer], [PLZ und Ort], Deutschland
            <br />
            E-Mail: contact@ffg-ve.org
          </p>
        </section>

        <section>
          <h2>2. Allgemeines zur Datenverarbeitung</h2>
          <p>
            Wir verarbeiten personenbezogene Daten unserer Nutzer grundsätzlich nur, soweit dies zur
            Bereitstellung einer funktionsfähigen Website sowie unserer Inhalte und Leistungen erforderlich
            ist, oder soweit gesetzliche Vorschriften dies gestatten.
          </p>
        </section>

        <section>
          <h2>3. Hosting und Server-Logfiles</h2>
          <p>
            Diese Website wird bei einem externen Hosting-Anbieter gehostet. Personenbezogene Daten, die auf
            dieser Website erfasst werden, werden auf dessen Servern gespeichert. Bei jedem Aufruf unserer
            Website erfasst unser System automatisiert Daten und Informationen (z. B. IP-Adresse, Datum und
            Uhrzeit, aufgerufene Seite, verwendeter Browser).
          </p>
        </section>

        <section>
          <h2>4. Kontakt-, Spenden- und Bewerbungsformulare</h2>
          <p>
            Wenn Sie uns über das Kontaktformular, das Spendenformular oder das Bewerbungsformular für
            Freiwillige Angaben zukommen lassen, werden Ihre Angaben zwecks Bearbeitung der Anfrage sowie für
            den Fall von Anschlussfragen bei uns gespeichert. Diese Daten geben wir nicht ohne Ihre
            Einwilligung weiter. Die Verarbeitung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b
            DSGVO, sofern Ihre Anfrage mit der Erfüllung eines Vertrags zusammenhängt oder zur Durchführung
            vorvertraglicher Maßnahmen erforderlich ist. In allen übrigen Fällen beruht die Verarbeitung auf
            unserem berechtigten Interesse an der effektiven Bearbeitung von Anfragen (Art. 6 Abs. 1 lit. f
            DSGVO) oder auf Ihrer Einwilligung (Art. 6 Abs. 1 lit. a DSGVO), sofern diese abgefragt wurde.
          </p>
          <p>
            Die für den Versand von Benachrichtigungs- und Bestätigungs-E-Mails eingesetzte
            E-Mail-Infrastruktur wird über einen externen Dienstleister betrieben.
          </p>
        </section>

        <section>
          <h2>5. Datenspeicherung (Firebase)</h2>
          <p>
            Zur Speicherung von Inhalten (Aktuelles, Programme, Galerie) sowie von Bewerbungs- und
            Spendendaten nutzen wir die Firebase-Dienste von Google Ireland Limited. Zugriffsrechte auf
            sensible Daten (Bewerbungen, Spenden) sind auf autorisierte Administratoren beschränkt.
          </p>
        </section>

        <section>
          <h2>6. Bildmaterial (Cloudinary)</h2>
          <p>
            Für die Bereitstellung von Bildern auf dieser Website nutzen wir den Dienst Cloudinary. Beim
            Laden von Bildern kann eine Verbindung zu Servern des Anbieters hergestellt werden.
          </p>
        </section>

        <section>
          <h2>7. Ihre Rechte</h2>
          <p>
            Sie haben jederzeit das Recht auf Auskunft, Berichtigung, Löschung oder Einschränkung der
            Verarbeitung Ihrer gespeicherten personenbezogenen Daten, ein Widerspruchsrecht gegen die
            Verarbeitung sowie ein Recht auf Datenübertragbarkeit. Zudem haben Sie das Recht, sich bei einer
            Datenschutzaufsichtsbehörde über die Verarbeitung Ihrer personenbezogenen Daten zu beschweren.
          </p>
        </section>

        <section>
          <h2>8. Änderung dieser Datenschutzerklärung</h2>
          <p>
            Wir behalten uns vor, diese Datenschutzerklärung anzupassen, damit sie stets den aktuellen
            rechtlichen Anforderungen entspricht oder um Änderungen unserer Leistungen umzusetzen.
          </p>
        </section>
      </div>
    </div>
  );
}
