import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Distances līgums | Honey Farm',
  description: 'Distances līguma noteikumi un nosacījumi.',
};

const DistancesLigumsPage = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-serif text-[#1D1D1F] mb-4">Distances līgums</h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            {new Date().toLocaleDateString('lv-LV', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <div className="prose prose-lg max-w-none">
          <section className="mb-12">
            <p className="text-gray-600">
              Tā kā <span className="bg-yellow-100 px-1">[UZŅĒMUMA NOSAUKUMS]</span> piedāvātās preces pārdošana notiek ar internetā izvietota piedāvājuma starpniecību vietnē <span className="bg-yellow-100 px-1">[JŪSU VIETNES URL]</span>, saskaņā ar Latvijas Republikas Patērētāju tiesību aizsardzības likuma (PTAL) 10. pantu, šādā gadījumā, pircējam veicot pasūtījumu, starp pircēju un pārdevēju tiek slēgts DISTANCES LĪGUMS.
            </p>
            <p className="text-gray-600 mt-4">
              Šis Distances līgums (turpmāk tekstā – Līgums) tiek slēgts starp interneta tirdzniecības vietnes <span className="bg-yellow-100 px-1">[JŪSU VIETNES URL]</span> īpašnieku <span className="bg-yellow-100 px-1">[UZŅĒMUMA NOSAUKUMS]</span>, reģistrācijas Nr. <span className="bg-yellow-100 px-1">[REĢISTRĀCIJAS NUMURS]</span>, juridiskā adrese: <span className="bg-yellow-100 px-1">[JURIDISKĀ ADRESE]</span>, (turpmāk tekstā – Pārdevējs), un Pircēju, kas izdara pasūtījumu un veic pirkumu <span className="bg-yellow-100 px-1">[JŪSU VIETNES URL]</span> interneta tirdzniecības vietnē.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-serif text-[#1D1D1F] mb-6">Līguma noteikumi</h2>
            <ol className="list-decimal pl-6 text-gray-600 space-y-4">
              <li>Līgums tiek noslēgts brīdī, kad Pircējs ir veicis pasūtījumu un, atbilstoši šiem noteikumiem, ir veicis samaksu par preci.</li>
              <li>Veicot pasūtījumu, Pircējs apliecina, ka ir iepazinies, saprot un pilnībā piekrīt Līgumam un tā noteikumiem.</li>
              <li>Pārdevējam ir tiesības bez brīdinājuma ierobežot Pircēja izmantojamos interneta tirdzniecības vietnes pakalpojumus, ja Pārdevējs uzskata, ka Pircējs var pārkāpt vai pārkāpj Līguma noteikumus, mēģina kaitēt Pārdevējam, interneta tirdzniecības vietnes darbībai vai drošībai, vai trešajām personām.</li>
              <li>Interneta tirdzniecības vietnē visas preču cenas ir norādītas, ieskaitot pievienotās vērtības nodokli 21%. Preču piegādes pakalpojuma izmaksas nav iekļautas norādītajā preces cenā.</li>
            </ol>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-serif text-[#1D1D1F] mb-6">Apmaksas veidi</h2>
            <p className="text-gray-600 mb-4">Par pasūtīto preci un izvēlēto piegādes pakalpojumu var norēķināties šādos veidos:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Saņemot priekšapmaksas rēķinu un veicot bankas pārskaitījumu</li>
              <li>Uzreiz pēc pasūtījuma veikšanas ar maksājuma kartēm Visa/MasterCard vai Swedbank, Citadele, SEB banka un Luminor banka interneta bankām</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-serif text-[#1D1D1F] mb-6">Piegādes veidi</h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Omniva pakomātā</li>
              <li>Venipak pakomātā vai Pickup punktā</li>
              <li>Kurjers piegādā pasūtīto preci Pircēja norādītajā adresē Rīgā, pēc iepriekšējas vienošanās</li>
              <li>Pārdevēja mazumtirdzniecības vietā veikalā <span className="bg-yellow-100 px-1">[VEIKALA NOSAUKUMS UN ADRESE]</span></li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-serif text-[#1D1D1F] mb-6">Preču saņemšana un piegāde</h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Ja preces piegādes veidu Pircējs norādījis saņemšanu veikalā, to nepieciešams izņemt 3 (trīs) darba dienu laikā no brīža, kad Pārdevējs apstiprinājis, ka pasūtījums sagatavots saņemšanai. Ilgāk prece netiek rezervēta.</li>
              <li>Pircējam ir pienākums nodrošināt, lai pasūtījumā norādītā persona preču piegādes brīdī atrastos pasūtījumā norādītajā adresē, uzrādītu kurjeram personu apliecinošu dokumentu, bez kavēšanās pieņemtu preces, parakstītu pavadzīmi, veiktu piezīmes pavadzīmē.</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-serif text-[#1D1D1F] mb-6">Atteikuma tiesības</h2>
            <p className="text-gray-600">
              Pircējam ir tiesības atteikties no preces 14 (četrpadsmit) kalendāro dienu laikā no Preces saņemšanas brīža, nosūtot Pārdevējam atteikuma vēstuli. Atteikuma vēstules veidlapu Pārdevējs nosūta Pircējam pa e-pastu pēc Pircēja pieprasījuma.
            </p>
            <div className="mt-6">
              <h3 className="text-2xl font-medium text-[#1D1D1F] mb-3">Atteikuma nosacījumi</h3>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Pircējam ir tiesības atkāpties no līguma 14 kalendāro dienu laikā un atdot interneta veikalā iegādāto preci atpakaļ pārdevējam</li>
                <li>Atsakoties no pirkuma patērētājs ir atbildīgs par preces kvalitātes un drošuma saglabāšanu atteikuma tiesību realizēšanas termiņā</li>
                <li>Iesakām saglabāt preces oriģinālo iepakojumu</li>
                <li>Pārdevējs saglabā tiesības ieturēt kompensācijas maksu vai atteikties pieņemt preci, kura ir bojāta, nav pilnā komplektācijā vai tā citādi zaudējusi savu sākotnējo izskatu</li>
                <li>Pircēja pienākums ir 7 (septiņu) dienu laikā pēc atteikuma vēstules nosūtīšanas atdot preci Pārdevējam</li>
                <li>Pārdevējs atgriež pilnu atgrieztās preces vērtību (piegādes izmaksas nav iekļautas) Pircējam 30 (trīsdesmit) dienu laikā pēc preces pieņemšanas</li>
                <li>Preču atgriešanas izdevumus sedz Pircējs</li>
              </ul>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-serif text-[#1D1D1F] mb-6">Kontaktinformācija</h2>
            <p className="text-gray-600">
              Lai saņemtu atteikuma vēstules veidlapu un vienotos par preces atgriešanu, lūdzu sazinieties ar mums:
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

export default DistancesLigumsPage; 