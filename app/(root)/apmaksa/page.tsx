import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Apmaksa | Honey Farm',
  description: 'Informācija par apmaksas veidiem un nosacījumiem.',
};

const ApmaksaPage = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-serif text-[#1D1D1F] mb-4">Apmaksa</h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            {new Date().toLocaleDateString('lv-LV', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <div className="prose prose-lg max-w-none">
          <section className="mb-12">
            <h2 className="text-3xl font-serif text-[#1D1D1F] mb-6">Pieejamie apmaksas veidi</h2>
            <p className="text-gray-600 mb-4">Mēs piedāvājam šādus apmaksas veidus:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-3">
              <li>
                Apmaksā pasūtījumu internetbankā:
                <ul className="list-none mt-2 space-y-1">
                  <li>• Swedbank</li>
                  <li>• Citadele</li>
                  <li>• SEB banka</li>
                  <li>• Luminor banka</li>
                </ul>
              </li>
              <li>Saņem priekšapmaksas rēķinu e-pastā</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-serif text-[#1D1D1F] mb-6">Kurjera piegādes apmaksa</h2>
            <p className="text-gray-600 mb-4">
              Izvēloties pasūtījumu saņemt izmantojot kurjeru pakalpojumu firmu, cena tiek piemērota saskaņā ar kurjera cenrādi:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-3">
              <li>Pēc iepriekšējas piegādes izmaksu saskaņošanas ar Pārdevēju saņem priekšapmaksas rēķinu e-pastā</li>
            </ul>
          </section>

          <section className="mb-12">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-2xl font-serif text-[#1D1D1F] mb-4">Svarīga informācija</h2>
              <p className="text-gray-600">
                *Maksājuma karšu un interneta banku maksājumu apstrādi nodrošina Stripe, Inc. - drošs un uzticams maksājumu pakalpojumu sniedzējs.
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-serif text-[#1D1D1F] mb-6">Kontaktinformācija</h2>
            <p className="text-gray-600">
              Ja jums ir jautājumi par apmaksu, lūdzu sazinieties ar mums:
            </p>
            <div className="mt-4 text-gray-600">
              <p>E-pasts: <span className="bg-yellow-100 px-1">[JŪSU E-PASTS]</span></p>
              <p>Tālrunis: <span className="bg-yellow-100 px-1">[JŪSU TĀLRUNIS]</span></p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ApmaksaPage; 