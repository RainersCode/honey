import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Lietošanas noteikumi | Honey Farm',
  description: 'Mūsu vietnes lietošanas noteikumi, distances līgums, piegādes un atgriešanas nosacījumi.',
};

const TermsPage = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-serif text-[#1D1D1F] mb-4">Lietošanas noteikumi</h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            {new Date().toLocaleDateString('lv-LV', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <div className="prose prose-lg max-w-none">
          <section className="mb-12">
            <h2 className="text-3xl font-serif text-[#1D1D1F] mb-6">Vispārīgie noteikumi</h2>
            <p className="text-gray-600">
              Šie noteikumi attiecas uz <span className="bg-yellow-100 px-1">[UZŅĒMUMA NOSAUKUMS]</span> interneta veikala lietošanu. Izmantojot mūsu pakalpojumus, Jūs piekrītat šiem noteikumiem. Lūdzu, rūpīgi izlasiet tos pirms mūsu pakalpojumu izmantošanas.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-serif text-[#1D1D1F] mb-6">Svarīgie dokumenti</h2>
            <div className="grid gap-6">
              <div className="p-6 border border-[#FFE4D2] rounded-lg hover:border-[#FF7A3D] transition-colors">
                <h3 className="text-2xl font-medium text-[#1D1D1F] mb-3">Distances līgums</h3>
                <p className="text-gray-600 mb-4">
                  Informācija par distances līguma noteikumiem, tā noslēgšanu un izpildi.
                </p>
                <Link 
                  href="/distances-ligums"
                  className="text-[#FF7A3D] hover:text-[#ff6a2a] font-medium inline-flex items-center"
                >
                  Lasīt vairāk
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>

              <div className="p-6 border border-[#FFE4D2] rounded-lg hover:border-[#FF7A3D] transition-colors">
                <h3 className="text-2xl font-medium text-[#1D1D1F] mb-3">Privātuma politika un sīkdatnes</h3>
                <p className="text-gray-600 mb-4">
                  Informācija par to, kā mēs apstrādājam Jūsu personas datus un izmantojam sīkdatnes.
                </p>
                <Link 
                  href="/privacy"
                  className="text-[#FF7A3D] hover:text-[#ff6a2a] font-medium inline-flex items-center"
                >
                  Lasīt vairāk
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>

              <div className="p-6 border border-[#FFE4D2] rounded-lg hover:border-[#FF7A3D] transition-colors">
                <h3 className="text-2xl font-medium text-[#1D1D1F] mb-3">Apmaksa</h3>
                <p className="text-gray-600 mb-4">
                  Informācija par pieejamajām apmaksas metodēm un norēķinu kārtību.
                </p>
                <Link 
                  href="/apmaksa"
                  className="text-[#FF7A3D] hover:text-[#ff6a2a] font-medium inline-flex items-center"
                >
                  Lasīt vairāk
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>

              <div className="p-6 border border-[#FFE4D2] rounded-lg hover:border-[#FF7A3D] transition-colors">
                <h3 className="text-2xl font-medium text-[#1D1D1F] mb-3">Piegāde un preču atgriešana</h3>
                <p className="text-gray-600 mb-4">
                  Informācija par preču piegādes noteikumiem un atgriešanas kārtību.
                </p>
                <Link 
                  href="/piegade-un-atgriesana"
                  className="text-[#FF7A3D] hover:text-[#ff6a2a] font-medium inline-flex items-center"
                >
                  Lasīt vairāk
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-serif text-[#1D1D1F] mb-6">Kontaktinformācija</h2>
            <p className="text-gray-600">
              Ja Jums ir jautājumi par lietošanas noteikumiem, lūdzu sazinieties ar mums:
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

export default TermsPage; 