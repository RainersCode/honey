'use client';

import { useEffect, useState } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown, MapPin, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

type OmnivaLocation = {
  id: string;
  name: string;
  address: string;
  city: string;
  country: string;
  type: string;
};

interface OmnivaLocationSelectorProps {
  value?: string;
  onSelect: (location: OmnivaLocation) => void;
  error?: boolean;
}

export function OmnivaLocationSelector({
  value,
  onSelect,
  error,
}: OmnivaLocationSelectorProps) {
  const [open, setOpen] = useState(false);
  const [locations, setLocations] = useState<OmnivaLocation[]>([]);
  const [selectedLocation, setSelectedLocation] =
    useState<OmnivaLocation | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch('/api/shipping/omniva');
        const data = await response.json();
        setLocations(data);
      } catch (error) {
        console.error('Failed to fetch Omniva locations:', error);
      }
    };

    fetchLocations();
  }, []);

  // Find and set selected location when value changes
  useEffect(() => {
    if (value && locations.length > 0) {
      const location = locations.find((loc) => loc.id === value);
      if (location) {
        setSelectedLocation(location);
      }
    }
  }, [value, locations]);

  const handleSelect = (location: OmnivaLocation) => {
    setSelectedLocation(location);
    onSelect(location);
    setOpen(false);
  };

  const filteredLocations = locations.filter((location) => {
    if (!searchQuery.trim()) return true;

    const searchLower = searchQuery.toLowerCase();
    return (
      location.name.toLowerCase().includes(searchLower) ||
      location.address.toLowerCase().includes(searchLower) ||
      location.city.toLowerCase().includes(searchLower)
    );
  });

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          aria-required='true'
          className={cn(
            'w-full justify-between border-[#FFE4D2] hover:bg-[#FFF5EE] hover:border-[#FF7A3D] text-left font-normal h-12 sm:h-14 py-2 sm:py-3 text-sm sm:text-base',
            error && 'border-red-500 hover:border-red-600'
          )}
        >
          {selectedLocation ? (
            <div className='flex items-start gap-2 min-w-0 flex-1'>
              <MapPin className='h-4 w-4 mt-0.5 shrink-0 text-[#FF7A3D]' />
              <div className='flex flex-col min-w-0 flex-1'>
                <span className='font-medium text-sm sm:text-base truncate'>
                  {selectedLocation.name}
                </span>
                <span className='text-xs sm:text-sm text-gray-600 truncate'>
                  {selectedLocation.address}
                </span>
              </div>
            </div>
          ) : (
            <div className='flex items-center gap-2 min-w-0 flex-1'>
              <MapPin
                className={cn(
                  'h-4 w-4 shrink-0',
                  error ? 'text-red-500' : 'text-[#FF7A3D]'
                )}
              />
              <span
                className={cn(
                  'text-sm sm:text-base truncate',
                  error ? 'text-red-500' : ''
                )}
              >
                Select Omniva location... *
              </span>
            </div>
          )}
          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className='w-[calc(100vw-2rem)] sm:w-[400px] max-w-[400px] p-0'
        align='start'
        side='bottom'
        sideOffset={4}
      >
        <div className='flex h-full w-full flex-col overflow-hidden rounded-md bg-white text-[#1D1D1F]'>
          {/* Search input */}
          <div className='flex items-center border-b border-[#FFE4D2] px-3 py-1'>
            <Search className='mr-2 h-4 w-4 shrink-0 opacity-50' />
            <input
              className='flex h-10 sm:h-11 w-full rounded-md bg-transparent py-2 sm:py-3 text-sm sm:text-base outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50'
              placeholder='Search locations...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Results list */}
          <div className='max-h-[40vh] sm:max-h-[300px] overflow-y-auto p-1'>
            {filteredLocations.length === 0 ? (
              <div className='py-6 text-center text-sm'>
                No locations match your search.
              </div>
            ) : (
              filteredLocations.map((location) => (
                <div
                  key={location.id}
                  onClick={() => handleSelect(location)}
                  className='flex items-start gap-3 px-3 py-3 sm:py-4 cursor-pointer hover:bg-[#FFF5EE] active:bg-[#FFE4D2] text-gray-900 rounded-sm my-1 transition-colors duration-200 touch-manipulation'
                >
                  <Check
                    className={cn(
                      'h-4 w-4 mt-1 shrink-0',
                      selectedLocation?.id === location.id
                        ? 'opacity-100 text-[#FF7A3D]'
                        : 'opacity-0'
                    )}
                  />
                  <div className='flex flex-col gap-1 min-w-0 flex-1'>
                    <span className='font-medium text-sm sm:text-base text-gray-900 leading-tight'>
                      {location.name}
                    </span>
                    <span className='text-xs sm:text-sm text-gray-600 leading-tight'>
                      {location.address}
                    </span>
                    <span className='text-xs text-gray-500'>
                      {location.city}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
