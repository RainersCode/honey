import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Piegāde un preču atgriešana | Honey Farm',
  description: 'Informācija par preču piegādi un atgriešanas noteikumiem.',
};

const PiegadeUnAtgriesanaPage = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-serif text-[#1D1D1F] mb-4">Piegāde un preču atgriešana</h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            {new Date().toLocaleDateString('lv-LV', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <div className="prose prose-lg max-w-none">
          <section className="mb-12">
            <h2 className="text-3xl font-serif text-[#1D1D1F] mb-6">Piegāde</h2>
            <div className="space-y-4">
              <ul className="list-none space-y-4">
                <li className="flex items-start gap-4">
                  <span className="font-medium text-[#1D1D1F] min-w-[80px]">3,00 EUR</span>
                  <span className="text-gray-600">Omniva pakomātā - pasūtījumiem izmērā līdz 38 x 64 x 39 cm un 30kg svarā.</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="font-medium text-[#1D1D1F] min-w-[80px]">2,80 EUR</span>
                  <span className="text-gray-600">Venipak pakomātā vai Pickup punktā - maksimālais pakas svars 10 kg</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="font-medium text-[#1D1D1F] min-w-[80px]">8,50 EUR</span>
                  <span className="text-gray-600">Pasūtījumu piegādāsim Rīgā jūsu norādītajā adresē iepriekš vienojoties</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="font-medium text-[#1D1D1F] min-w-[80px]">BEZMAKSAS</span>
                  <span className="text-gray-600">Pasūtījumu saņem veikalā "Baļļas medus un bišu lietas" Kuldīgā, Liepājas ielā 24*</span>
                </li>
              </ul>

              <div className="bg-gray-50 p-6 rounded-lg mt-6">
                <p className="text-gray-600 mb-4">
                  PIEGĀDES MAKSA, izvēloties kurjerpakalpojumu firmu, tiek aprēķināta saskaņā ar pakalpojuma sniedzēja cenrādi (attiecībā pret pasūtījuma izmēru un svaru). Par pasūtījuma piegādi Pārdevējs nosūta Pircējam atsevišķu priekšapmaksas rēķinu.
                </p>
                <p className="text-gray-600">
                  *Ja izvēlies pasūtījumu saņemt un apmaksāt veikalā Kuldīgā, to nepieciešams izņemt 3 (trīs) darba dienu laikā no brīža, kad esam apstiprinājuši pasūtījuma gatavību saņemšanai - ilgāk prece netiks rezervēta.
                </p>
              </div>

              <p className="text-gray-600 mt-6">
                Drošu un ātru preču piegādi nodrošinām ar Omniva Latvija starpniecību.
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-serif text-[#1D1D1F] mb-6">Preču atgriešana</h2>
            <p className="text-gray-600 mb-6">
              Pasūtīto preci ir iespējams atgriezt 14 (četrpadsmit) kalendāro dienu laikā no preces saņemšanas brīža.
            </p>

            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-serif text-[#1D1D1F] mb-4">Kā es varu atgriezt preci?</h3>
                <ol className="list-decimal pl-6 text-gray-600 space-y-2">
                  <li>Sazinies ar mums, rakstot uz <span className="bg-yellow-100 px-1">info@ballas.lv</span> vai zvanot pa tālruni <span className="bg-yellow-100 px-1">+371 63322656</span> un pastāsti ka vēlies atgriezt pirkumu;</li>
                  <li>Mēs tev nosūtīsim atteikuma vēstules formu;</li>
                  <li>7 dienu laikā, kopš formas saņemšanas, atsūti mums atpakaļ aizpildītu atteikuma vēstuli un preci;</li>
                  <li>Mēs novērtēsim atgrieztās preces kvalitāti, un 30 dienu laikā atgriezīsim preces vērtību.</li>
                </ol>
              </div>

              <div>
                <h3 className="text-2xl font-serif text-[#1D1D1F] mb-4">Kādos gadījumos es varu atgriezt preci?</h3>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>Ja pārdomā un nolem, ka tomēr preci nevēlies;</li>
                  <li>Ja prece neatbilst gaidītajai;</li>
                  <li>Ja prece piegādes laikā ir bojāta (lai apliecinātu, ka bojājumi radušies piegādes laikā, lūdzam, bojātās preces saņemšanas brīdī, bojājumus nofotografēt un nekavējoties sazināties ar mums).</li>
                </ul>
              </div>

              <div>
                <h3 className="text-2xl font-serif text-[#1D1D1F] mb-4">Kādos gadījumos preci nav iespējams atgriezt?</h3>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>Ja prece, atrodoties pircēja uzraudzībā, ir tīši vai netīši bojāta;</li>
                  <li>Ja prece nav pilnā komplektācijā (iepakojums, detaļas, svars, daudzums);</li>
                  <li>Ja prece, atrodoties pircēja uzraudzībā, ir zaudējusi savu sākotnējo izskatu.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-2xl font-serif text-[#1D1D1F] mb-4">Kas sedz atgriešanas izmaksas?</h3>
                <p className="text-gray-600">
                  Pircējs, izņemot gadījumos, kad tiek atgriezta piegādes laikā bojāta prece.
                </p>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg mt-8">
              <p className="text-gray-600 mb-4">
                Preču atgriešanas kārtība notiek saskaņā ar Latvijas Republikas Patērētāju tiesību aizsardzības likumu (PTAL) un reglamentējošiem Ministru Kabineta Noteikumiem Nr.255 "Noteikumi par distances līgumu" (MK Noteikumi Nr. 255).
              </p>
              <p className="text-gray-600">
                Iepazīsties ar{' '}
                <Link href="/distances-ligums" className="text-orange-600 hover:text-orange-700">
                  DISTANCES LĪGUMU
                </Link>
                {' '}un uzzini vairāk par atteikuma tiesībām.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PiegadeUnAtgriesanaPage; 