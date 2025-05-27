'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Locale } from '@/config/i18n.config';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Plus, Search, Trash2 } from 'lucide-react';
import {
  addCountry,
  updateCountry,
  deleteCountry,
} from '@/lib/actions/country.actions';
import { countries } from 'countries-list';
import Flag from 'react-world-flags';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface Country {
  id: string;
  name: string;
  code: string;
  flag: string;
  isActive: boolean;
}

interface CountryTableProps {
  countries: Country[];
  lang: Locale;
}

// Component to display flag with consistent styling
const CountryFlag = ({ countryCode }: { countryCode: string }) => (
  <div className='inline-block mr-2 w-8 h-6 overflow-hidden rounded-sm border border-gray-200'>
    <Flag
      code={countryCode}
      fallback={<span>{countryCode}</span>}
      height='24'
    />
  </div>
);

export default function CountryTable({
  countries: existingCountries,
  lang,
}: CountryTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [availableCountries, setAvailableCountries] = useState<
    Array<{ code: string; name: string }>
  >([]);
  const [filteredCountries, setFilteredCountries] = useState<
    Array<{ code: string; name: string }>
  >([]);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    // Convert countries object to array and filter out already added countries
    const existingCodes = new Set(existingCountries.map((c) => c.code));
    const countriesArray = Object.entries(countries)
      .map(([code, data]) => ({
        code,
        name: data.name,
      }))
      .filter((country) => !existingCodes.has(country.code));

    setAvailableCountries(countriesArray);
    setFilteredCountries(countriesArray);
  }, [existingCountries]);

  useEffect(() => {
    const filtered = availableCountries.filter(
      (country) =>
        country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        country.code.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCountries(filtered);
  }, [searchTerm, availableCountries]);

  const handleAddCountry = async (country: { code: string; name: string }) => {
    try {
      const result = await addCountry({
        name: country.name,
        code: country.code,
        flag: country.code, // Store the country code as the flag identifier
      });

      if (result.success) {
        toast({
          title: 'Success',
          description: 'Country added successfully',
        });
        router.refresh();
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.message || 'Failed to add country',
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to add country',
      });
    }
  };

  const handleToggleActive = async (country: Country) => {
    try {
      const result = await updateCountry(country.id, {
        isActive: !country.isActive,
      });
      if (result.success) {
        toast({
          title: 'Success',
          description: `Country ${country.isActive ? 'disabled' : 'enabled'} successfully`,
        });
        router.refresh();
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.message || 'Failed to update country',
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update country',
      });
    }
  };

  const handleDeleteCountry = async (country: Country) => {
    try {
      const result = await deleteCountry(country.id);
      if (result.success) {
        toast({
          title: 'Success',
          description: 'Country deleted successfully',
        });
        router.refresh();
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.message || 'Failed to delete country',
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete country',
      });
    }
  };

  return (
    <div className='space-y-6'>
      <Card>
        <CardHeader>
          <CardTitle>Add New Country</CardTitle>
          <CardDescription>
            Add a new country to the shipping destinations list
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            <div className='flex items-center space-x-2'>
              <Search className='w-5 h-5 text-gray-400' />
              <Input
                placeholder='Search for a country...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='flex-1'
              />
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-60 overflow-y-auto p-2 border rounded-md'>
              {filteredCountries.map((country) => (
                <Button
                  key={country.code}
                  variant='outline'
                  className='flex items-center justify-between p-2 hover:bg-gray-100 h-auto'
                  onClick={() => handleAddCountry(country)}
                >
                  <div className='flex items-center flex-1 min-w-0'>
                    <CountryFlag countryCode={country.code} />
                    <span className='flex-1 truncate text-left'>
                      {country.name}
                    </span>
                  </div>
                  <span className='text-sm text-gray-500 ml-2'>
                    {country.code}
                  </span>
                </Button>
              ))}
              {filteredCountries.length === 0 && (
                <div className='col-span-full text-center py-4 text-gray-500'>
                  No countries found
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Countries List</CardTitle>
          <CardDescription>
            Manage available shipping destinations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Flag</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className='text-right'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {existingCountries.map((country) => (
                <TableRow key={country.id}>
                  <TableCell>
                    <CountryFlag countryCode={country.code} />
                  </TableCell>
                  <TableCell className='font-medium'>{country.name}</TableCell>
                  <TableCell>{country.code}</TableCell>
                  <TableCell>
                    <Switch
                      checked={country.isActive}
                      onCheckedChange={() => handleToggleActive(country)}
                    />
                  </TableCell>
                  <TableCell className='text-right space-x-2'>
                    <Button
                      variant='ghost'
                      className='text-[#FF7A3D] hover:text-[#FF7A3D]/90 hover:bg-[#FF7A3D]/10'
                      onClick={() => handleToggleActive(country)}
                    >
                      {country.isActive ? 'Disable' : 'Enable'}
                    </Button>
                    <Button
                      variant='ghost'
                      className='text-red-600 hover:text-red-700 hover:bg-red-50'
                      onClick={() => handleDeleteCountry(country)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
