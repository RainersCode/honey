import { prisma } from '@/db/prisma';
import { getDictionary } from '@/lib/dictionary';
import { Locale } from '@/config/i18n.config';
import CountryTable from './country-table';

export const metadata = {
  title: 'Countries Management',
};

export default async function CountriesPage({
  params,
}: {
  params: { lang: Locale };
}) {
  const dict = await getDictionary(params.lang);

  // Get all countries
  const countries = await prisma.country.findMany({
    orderBy: {
      name: 'asc',
    },
  });

  return (
    <div className='max-w-7xl mx-auto px-4 py-8'>
      <div className='text-center mb-10'>
        <h1 className='text-3xl font-serif text-[#1D1D1F] mb-2'>
          {dict.admin.countries.title}
        </h1>
        <div className='w-20 h-1 bg-[#FF7A3D] mx-auto rounded-full'></div>
      </div>

      <CountryTable countries={countries} lang={params.lang} />
    </div>
  );
}
