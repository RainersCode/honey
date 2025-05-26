'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { DELIVERY_METHODS } from '@/lib/constants';
import { OmnivaLocationSelector } from '@/components/shared/omniva-location-selector';
import { updateCartDeliveryMethod } from '@/lib/actions/cart.actions';

// Add a comprehensive list of countries
const countries = [
  { code: 'US', name: 'United States' },
  { code: 'CA', name: 'Canada' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'AU', name: 'Australia' },
  { code: 'NZ', name: 'New Zealand' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'IT', name: 'Italy' },
  { code: 'ES', name: 'Spain' },
  { code: 'PT', name: 'Portugal' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'BE', name: 'Belgium' },
  { code: 'CH', name: 'Switzerland' },
  { code: 'AT', name: 'Austria' },
  { code: 'SE', name: 'Sweden' },
  { code: 'NO', name: 'Norway' },
  { code: 'DK', name: 'Denmark' },
  { code: 'FI', name: 'Finland' },
  { code: 'IE', name: 'Ireland' },
  { code: 'JP', name: 'Japan' },
  { code: 'KR', name: 'South Korea' },
  { code: 'SG', name: 'Singapore' },
  { code: 'MY', name: 'Malaysia' },
  { code: 'TH', name: 'Thailand' },
  { code: 'IN', name: 'India' },
  { code: 'BR', name: 'Brazil' },
  { code: 'MX', name: 'Mexico' },
  { code: 'AR', name: 'Argentina' },
  { code: 'CL', name: 'Chile' },
  { code: 'CO', name: 'Colombia' },
].sort((a, b) => a.name.localeCompare(b.name));

interface ShippingCalculatorProps {
  cartWeight: number;
  onRateSelect: (rate: { service: string; rate: number }) => void;
}

export default function ShippingCalculator({ cartWeight, onRateSelect }: ShippingCalculatorProps) {
  const [loading, setLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<'international' | 'omniva'>('international');
  const [showOmnivaSelector, setShowOmnivaSelector] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [postalCode, setPostalCode] = useState<string>('');
  const [shippingRates, setShippingRates] = useState<Array<{
    service: string;
    rate: number;
    carrier: string;
    delivery_days?: number;
  }>>([]);
  const { toast } = useToast();

  const calculateShippingRates = async () => {
    if (!selectedCountry || !postalCode) {
      toast({
        title: "Required Fields",
        description: "Please select a country and enter a postal code",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/shipping/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          toAddress: {
            country: selectedCountry,
            zip: postalCode,
          },
          weight: cartWeight,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setShippingRates(data.rates);
      if (data.rates.length > 0) {
        onRateSelect({
          service: data.rates[0].service,
          rate: data.rates[0].rate,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to calculate shipping rates",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleShippingMethodChange = async (method: 'international' | 'omniva') => {
    setSelectedMethod(method);
    setShowOmnivaSelector(method === 'omniva');
    
    try {
      // Update cart with the new delivery method
      const result = await updateCartDeliveryMethod(method);
      
      if (!result.success) {
        toast({
          title: "Error",
          description: "Failed to update delivery method",
          variant: "destructive",
        });
        return;
      }

      // Set default rates based on method
      if (method === 'omniva') {
        onRateSelect({
          service: 'Omniva Pickup',
          rate: 3.10
        });
      } else {
        // For international, we'll let the calculator determine the exact rate
        setShippingRates([]);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update delivery method",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Delivery Method</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <RadioGroup
            value={selectedMethod}
            onValueChange={(value: 'international' | 'omniva') => handleShippingMethodChange(value)}
            className="grid grid-cols-2 gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="international" id="international" />
              <Label htmlFor="international" className="flex flex-col">
                <span className="font-medium">International Shipping</span>
                <span className="text-sm text-muted-foreground">Worldwide delivery</span>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="omniva" id="omniva" />
              <Label htmlFor="omniva" className="flex flex-col">
                <span className="font-medium">Omniva Pickup</span>
                <span className="text-sm text-muted-foreground">Local parcel machines</span>
              </Label>
            </div>
          </RadioGroup>

          {selectedMethod === 'international' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Country</Label>
                  <Select
                    value={selectedCountry}
                    onValueChange={setSelectedCountry}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country.code} value={country.code}>
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Postal Code</Label>
                  <Input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="Enter postal code"
                  />
                </div>
              </div>
              <Button
                onClick={calculateShippingRates}
                disabled={loading || !selectedCountry || !postalCode}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Calculating...
                  </>
                ) : (
                  'Calculate Shipping'
                )}
              </Button>

              {shippingRates.length > 0 && (
                <div className="mt-4 space-y-2">
                  <Label>Available Shipping Options</Label>
                  <RadioGroup
                    onValueChange={(value) => {
                      const rate = shippingRates.find((r) => r.service === value);
                      if (rate) {
                        onRateSelect({
                          service: rate.service,
                          rate: rate.rate,
                        });
                      }
                    }}
                    defaultValue={shippingRates[0].service}
                  >
                    {shippingRates.map((rate) => (
                      <div key={rate.service} className="flex items-center space-x-2">
                        <RadioGroupItem value={rate.service} id={rate.service} />
                        <Label htmlFor={rate.service} className="flex flex-col">
                          <span className="font-medium">{rate.carrier} - {rate.service}</span>
                          <span className="text-sm text-muted-foreground">
                            {rate.rate.toFixed(2)} € {rate.delivery_days ? `(${rate.delivery_days} days)` : ''}
                          </span>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              )}
            </div>
          )}

          {showOmnivaSelector && (
            <div className="mt-4">
              <Label>Select Pickup Location</Label>
              <OmnivaLocationSelector
                onSelect={(location) => {
                  toast({
                    title: "Location Selected",
                    description: `Pickup location: ${location.name}`,
                  });
                }}
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 