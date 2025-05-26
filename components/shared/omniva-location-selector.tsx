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
}

export function OmnivaLocationSelector({ value, onSelect }: OmnivaLocationSelectorProps) {
  const [open, setOpen] = useState(false);
  const [locations, setLocations] = useState<OmnivaLocation[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<OmnivaLocation | null>(null);
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

  const handleSelect = (location: OmnivaLocation) => {
    setSelectedLocation(location);
    onSelect(location);
    setOpen(false);
  };

  const filteredLocations = locations.filter(location => {
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
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-required="true"
          className="w-full justify-between border-[#FFE4D2] hover:bg-[#FFF5EE] hover:border-[#FF7A3D] text-left font-normal"
        >
          {selectedLocation ? (
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-[#FF7A3D]" />
              <div className="flex flex-col">
                <span className="font-medium">{selectedLocation.name}</span>
                <span className="text-sm text-gray-600">{selectedLocation.address}</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 shrink-0 text-[#FF7A3D]" />
              <span>Select Omniva location... *</span>
            </div>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="start">
        <div className="flex h-full w-full flex-col overflow-hidden rounded-md bg-white text-[#1D1D1F]">
          {/* Search input */}
          <div className="flex items-center border-b border-[#FFE4D2] px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <input
              className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Search Omniva locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {/* Results list */}
          <div className="max-h-[300px] overflow-y-auto p-1">
            {filteredLocations.length === 0 ? (
              <div className="py-6 text-center text-sm">No locations match your search.</div>
            ) : (
              filteredLocations.map((location) => (
                <div 
                  key={location.id}
                  onClick={() => handleSelect(location)}
                  className="flex items-start gap-2 px-3 py-2 cursor-pointer hover:bg-[#FFF5EE] text-gray-900 rounded-sm my-1"
                >
                  <Check
                    className={cn(
                      "h-4 w-4 mt-0.5 shrink-0",
                      selectedLocation?.id === location.id ? "opacity-100 text-[#FF7A3D]" : "opacity-0"
                    )}
                  />
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-900">{location.name}</span>
                    <span className="text-sm text-gray-600">{location.address}</span>
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