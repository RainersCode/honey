import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privātuma politika un sīkdatnes',
  description: 'Mūsu privātuma politika un sīkdatņu izmantošanas noteikumi.',
};

const PrivacyPolicyPage = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-serif text-[#1D1D1F] mb-4">Privātuma politika un sīkdatnes</h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            {new Date().toLocaleDateString('lv-LV', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <div className="prose prose-lg max-w-none">
          <section className="mb-12">
            <h2 className="text-3xl font-serif text-[#1D1D1F] mb-6">Privātuma politika</h2>
            <p className="text-gray-600">
              Šī privātuma politika informē par privātuma praksi un personas datu apstrādes principiem saistībā ar <span className="bg-yellow-100 px-1">[UZŅĒMUMA NOSAUKUMS]</span>, reģistrācijas Nr. <span className="bg-yellow-100 px-1">[REĢISTRĀCIJAS NUMURS]</span>, juridiskā adrese: <span className="bg-yellow-100 px-1">[JURIDISKĀ ADRESE]</span> interneta vietni <span className="bg-yellow-100 px-1">[JŪSU VIETNES URL]</span> un pakalpojumiem. Lai sazinātos saistībā ar datu apstrādes jautājumiem, lūdzu rakstiet e-pastu uz <span className="bg-yellow-100 px-1">[JŪSU E-PASTS]</span>.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-serif text-[#1D1D1F] mb-6">Pasūtījumu veikšana un datu apstrāde</h2>
            <p className="text-gray-600">
              Ievadot nepieciešamo informāciju, noformējot pasūtījumu, Pircējs apliecina, ka ir iepazinies un piekrīt, ka viņa sniegtie dati tiek izmantoti, lai Pārdevējs varētu pieņemt Pircēja pasūtījumu un veikt preču piegādi saskaņā ar normatīvo aktu prasībām. Ievadot informāciju, Pircējs piekrīt, ka tam uz norādīto e-pastu tiks izsūtīti paziņojumi, kas saistīti ar Pircēja pasūtījuma apstrādi.
            </p>
            <p className="text-gray-600 mt-4">
              Sniedzot informāciju par sevi, Pircējs dod tiesības Pārdevējam atlasīt, uzkrāt, sistematizēt un izmantot visu to informāciju un datus, kurus Pircējs tieši vai netieši sniedzis, izmantojot interneta tirdzniecības vietnes pakalpojumus.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-serif text-[#1D1D1F] mb-6">Datu izmantošana un aizsardzība</h2>
            <p className="text-gray-600">
              Pircēja sniegtos personas datus izmantos tikai Pārdevējs un tā partneri, ar kuriem Pārdevējs sadarbojas, veicot interneta tirdzniecības vietnes administrēšanu, preču piegādi un citus ar Pircēja pasūtījuma izpildi saistītus pakalpojumus. Pārdevējs apliecina, ka neatklās Pircēja personas datus citām trešajām personām, izņemot Latvijas Republikas tiesību aktos noteiktos gadījumos.
            </p>
            <p className="text-gray-600 mt-4">
              Pircēja personas datu aizsardzībai Pārdevējs izmanto dažādus tehniskus un organizatoriskus drošības pasākumus. Pircēja personas dati ir pieejami ierobežotam cilvēku skaitam, tikai pilnvarotām personām.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-serif text-[#1D1D1F] mb-6">Jūsu tiesības saistībā ar jūsu personas datiem</h2>
            <p className="text-gray-600">
              Ja jūs esat datu subjekts saskaņā ar ES VDAR, jums ir šādas tiesības:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mt-4">
              <li><strong>Tiesības piekļūt informācijai</strong> - saņemt informāciju par to, kāpēgi un kā tiek apstrādāti jūsu personas dati, kā arī saņemt datu kopiju elektroniskā formātā.</li>
              <li><strong>Tiesības labot</strong> - panākt neprecīzu vai nepilnīgu personas datu labošanu vai papildināšanu.</li>
              <li><strong>Tiesības "tikt aizmirstam"</strong> - atsaukt piekrišanu datu apstrādei un panākt datu dzēšanu.</li>
              <li><strong>Tiesības ierobežot apstrādi</strong> - noteiktos gadījumos pieprasīt datu apstrādes ierobežošanu.</li>
              <li><strong>Tiesības iebilst</strong> - iebilst pret datu apstrādi, ja vien tas nav nepieciešams sabiedrības interesēs.</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-serif text-[#1D1D1F] mb-6">Sīkdatņu politika</h2>
            <p className="text-gray-600">
              Sīkdatnes palīdz sniegt, uzlabot un aizsargāt mūsu pakalpojumus, nodrošinot klienta vajadzībām piemērotākus piedāvājumus, kā arī ērtāku un drošāku lietošanas pieredzi.
            </p>
            
            <h3 className="text-2xl font-medium text-[#1D1D1F] mt-6 mb-4">Kas ir sīkdatnes?</h3>
            <p className="text-gray-600">
              Sīkdatne ir maza teksta datne, kas tiek saglabāta datorā vai citā lietotajā ierīcē (piemēram, mobilajā tālrunī) brīdī, kad Jūs apmeklējat tīmekļa vietni. Teksta datnē ir informācija, kas tiek izmantota, lai konkrētas tīmekļa vietnes apmeklētājiem uzlabotu vietnes lietošanas pieredzi.
            </p>

            <h3 className="text-2xl font-medium text-[#1D1D1F] mt-6 mb-4">Sīkdatņu veidi un to izmantošanas mērķi</h3>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mt-4">
              <li><strong>Lietotāja autentifikācija</strong> - paredz lietotāja atpazīšanu un drošāku interneta vietnes izmantošanu.</li>
              <li><strong>Pakalpojumu nodrošināšana un uzturēšana</strong> - sīkdatnes, kas funkcionāli atbalsta pakalpojumu nodrošināšanu.</li>
              <li><strong>Vietnes drošība un integritāte</strong> - sīkdatnes, kas palīdz veidot drošus pakalpojumus.</li>
              <li><strong>Lietošanas statistika un analīze</strong> - nodrošina informāciju par vietnes lietošanas paradumiem.</li>
              <li><strong>Pakalpojumu piedāvāšana</strong> - sīkdatnes, kas nodrošina personalizētus piedāvājumus.</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-serif text-[#1D1D1F] mb-6">Sīkdatņu kontrole</h2>
            <p className="text-gray-600">
              Ja nevēlaties, lai Jūsu lietotajās ierīcēs tiktu izmantotas sīkdatnes, Jūs varat mainīt pārlūkprogrammas drošības iestatījumus. Pievērsiet uzmanību, ka izmaiņas drošības iestatījumos jāveic katrai pārlūkprogrammai atsevišķi un izmantotās iestatījumu metodes var atšķirties. Tomēr atcerieties, ka bez sesijas sīkdatņu apstiprināšanas Jūs nevarēsiet pilnvērtīgi izmantot mūsu interneta pakalpojumus.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-serif text-[#1D1D1F] mb-6">Kontaktinformācija</h2>
            <p className="text-gray-600">
              Ja Jums ir jautājumi par sīkdatņu izmantošanu mūsu interneta resursos vai Jūsu personas datu apstrādi, lūdzu sazinieties ar mums:
            </p>
            <div className="mt-4 text-gray-600">
              <p>E-pasts: <span className="bg-yellow-100 px-1">[JŪSU E-PASTS]</span></p>
              <p>Tālrunis: <span className="bg-yellow-100 px-1">[JŪSU TĀLRUNIS]</span></p>
              <p>Adrese: <span className="bg-yellow-100 px-1">[JŪSU ADRESE]</span></p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage; 