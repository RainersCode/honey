'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { OmnivaLocationSelector } from '@/components/shared/omniva-location-selector';
import {
  updateCartDeliveryMethod,
  getShippingRules,
} from '@/lib/actions/cart.actions';
import { formatCurrency } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { Plane, MapPin } from 'lucide-react';
import { Locale } from '@/config/i18n.config';
import { getDictionary } from '@/lib/dictionary';

interface ShippingRule {
  id: string;
  zone: string;
  minWeight: any; // Prisma Decimal
  maxWeight: any; // Prisma Decimal
  price: any; // Prisma Decimal
  carrier: string;
}

interface ShippingCalculatorProps {
  cartWeight: number;
  onRateSelect: (rate: { service: string; rate: number } | null) => void;
  lang: Locale;
}

export default function ShippingCalculator({
  cartWeight,
  onRateSelect,
  lang,
}: ShippingCalculatorProps) {
  const [selectedMethod, setSelectedMethod] = useState<
    'international' | 'omniva'
  >('international');
  const [showOmnivaSelector, setShowOmnivaSelector] = useState(false);
  const [shippingRules, setShippingRules] = useState<ShippingRule[]>([]);
  const [currentRule, setCurrentRule] = useState<ShippingRule | null>(null);
  const [weightError, setWeightError] = useState<string | null>(null);
  const [dict, setDict] = useState<any>(null);
  const { toast } = useToast();
  const router = useRouter();

  // Load dictionary
  useEffect(() => {
    const loadDictionary = async () => {
      const dictionary = await getDictionary(lang);
      setDict(dictionary);
    };

    loadDictionary();
  }, [lang]);

  // Fetch shipping rules when method changes
  useEffect(() => {
    const fetchShippingRules = async () => {
      const result = await getShippingRules(cartWeight, selectedMethod);
      if (result.success) {
        setShippingRules(result.allRules || []);
        setCurrentRule(result.currentRule || null);

        // Check if weight exceeds maximum allowed weight
        const allRules = result.allRules || [];
        const maxAllowedWeight =
          allRules.length > 0
            ? Math.max(...allRules.map((rule) => Number(rule.maxWeight)))
            : Infinity; // If no rules, allow any weight

        if (cartWeight > maxAllowedWeight && maxAllowedWeight !== Infinity) {
          setWeightError(
            `${dict?.cart?.weightLimit?.error || 'Weight exceeds maximum allowed weight of'} ${maxAllowedWeight}kg ${dict?.cart?.weightLimit?.forMethod || 'for'} ${selectedMethod === 'omniva' ? dict?.cart?.delivery?.omniva || 'Omniva' : dict?.cart?.delivery?.international || 'international'} ${dict?.cart?.weightLimit?.deliveryMethod || 'shipping delivery method'}`
          );
          onRateSelect(null); // Clear selected rate
        } else {
          setWeightError(null);
          // If we have a current rule, update the cart with its price
          if (result.currentRule) {
            const rate = {
              service:
                selectedMethod === 'omniva'
                  ? 'Omniva Pickup'
                  : 'International Shipping',
              rate: Number(result.currentRule.price),
            };
            onRateSelect(rate);
          }
        }
      }
    };

    fetchShippingRules();
  }, [selectedMethod, cartWeight]);

  // Apply shipping rate when method changes
  useEffect(() => {
    const applyShippingRate = async () => {
      try {
        const result = await updateCartDeliveryMethod(selectedMethod);

        if (!result.success) {
          toast({
            title: dict?.common?.error || 'Error',
            description:
              result.message ||
              dict?.cart?.delivery?.updateError ||
              'Failed to update delivery method',
            variant: 'destructive',
          });
          return;
        }

        // Force a server refresh to get updated cart data
        router.refresh();
      } catch (error) {
        toast({
          title: dict?.common?.error || 'Error',
          description:
            dict?.cart?.delivery?.updateError ||
            'Failed to update delivery method',
          variant: 'destructive',
        });
      }
    };

    applyShippingRate();
  }, [selectedMethod, cartWeight]); // Re-run when method or weight changes

  const handleShippingMethodChange = (method: 'international' | 'omniva') => {
    setSelectedMethod(method);
    setShowOmnivaSelector(method === 'omniva');
  };

  if (!dict) return null;

  return (
    <Card className='w-full shadow-sm border-gray-200'>
      <CardHeader className='pb-3'>
        <CardTitle className='text-lg font-serif text-[#1D1D1F] flex items-center gap-2'>
          <MapPin className='h-4 w-4 text-[#FF7A3D]' />
          {dict.cart.delivery.title || 'Delivery Method'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          <RadioGroup
            value={selectedMethod}
            onValueChange={(value: 'international' | 'omniva') =>
              handleShippingMethodChange(value)
            }
            className='grid grid-cols-1 gap-3'
          >
            <div
              className={`relative p-3 rounded-lg border-2 transition-all duration-300 cursor-pointer hover:shadow-sm ${
                selectedMethod === 'international'
                  ? 'border-[#FF7A3D] bg-[#FF7A3D]/5'
                  : 'border-gray-200 hover:border-[#FF7A3D]/50'
              }`}
            >
              <div className='flex items-center space-x-2'>
                <RadioGroupItem
                  value='international'
                  id='international'
                  className='text-[#FF7A3D]'
                />
                <div className='flex items-center space-x-2 flex-1'>
                  <div
                    className={`p-1.5 rounded-md ${
                      selectedMethod === 'international'
                        ? 'bg-[#FF7A3D] text-white'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    <Plane className='h-3.5 w-3.5' />
                  </div>
                  <Label
                    htmlFor='international'
                    className='flex flex-col cursor-pointer'
                  >
                    <span className='font-medium text-sm text-[#1D1D1F]'>
                      {dict.cart.delivery.international ||
                        'International Shipping'}
                    </span>
                    <span className='text-xs text-gray-500'>
                      {dict.cart.delivery.internationalDesc ||
                        'Worldwide delivery'}
                    </span>
                  </Label>
                </div>
              </div>
            </div>

            <div
              className={`relative p-3 rounded-lg border-2 transition-all duration-300 cursor-pointer hover:shadow-sm ${
                selectedMethod === 'omniva'
                  ? 'border-[#FF7A3D] bg-[#FF7A3D]/5'
                  : 'border-gray-200 hover:border-[#FF7A3D]/50'
              }`}
            >
              <div className='flex items-center space-x-2'>
                <RadioGroupItem
                  value='omniva'
                  id='omniva'
                  className='text-[#FF7A3D]'
                />
                <div className='flex items-center space-x-2 flex-1'>
                  <div
                    className={`p-1.5 rounded-md ${
                      selectedMethod === 'omniva'
                        ? 'bg-[#FF7A3D] text-white'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    <MapPin className='h-3.5 w-3.5' />
                  </div>
                  <Label
                    htmlFor='omniva'
                    className='flex flex-col cursor-pointer'
                  >
                    <span className='font-medium text-sm text-[#1D1D1F]'>
                      {dict.cart.delivery.omniva || 'Omniva Pickup'}
                    </span>
                    <span className='text-xs text-gray-500'>
                      {dict.cart.delivery.omnivaDesc || 'Local parcel machines'}
                    </span>
                  </Label>
                </div>
              </div>
            </div>
          </RadioGroup>

          {weightError && (
            <div className='text-red-500 text-sm mt-2'>{weightError}</div>
          )}

          {showOmnivaSelector && !weightError && (
            <OmnivaLocationSelector
              onSelect={(location) => {
                // Store the selected Omniva location for later use in forms
                console.log('Selected Omniva location:', location);
              }}
            />
          )}

          {!weightError && currentRule && (
            <div className='mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='font-medium text-sm text-[#1D1D1F]'>
                    {dict.cart.delivery.shippingCost || 'Shipping cost'}:{' '}
                    {formatCurrency(Number(currentRule.price))}
                  </p>
                  <p className='hidden text-xs text-gray-500'>
                    {dict.cart.delivery.forWeight || 'For weight'}:{' '}
                    {Number(cartWeight.toFixed(2))}kg
                  </p>
                </div>
                <div className='text-[#FF7A3D] font-semibold text-base'>
                  {formatCurrency(Number(currentRule.price))}
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
