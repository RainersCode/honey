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

interface ShippingRule {
  id: string;
  zone: string;
  minWeight: number;
  maxWeight: number;
  price: number;
  carrier: string;
}

interface ShippingCalculatorProps {
  cartWeight: number;
  onRateSelect: (rate: { service: string; rate: number } | null) => void;
}

export default function ShippingCalculator({
  cartWeight,
  onRateSelect,
}: ShippingCalculatorProps) {
  const [selectedMethod, setSelectedMethod] = useState<
    'international' | 'omniva'
  >('international');
  const [showOmnivaSelector, setShowOmnivaSelector] = useState(false);
  const [shippingRules, setShippingRules] = useState<ShippingRule[]>([]);
  const [currentRule, setCurrentRule] = useState<ShippingRule | null>(null);
  const [weightError, setWeightError] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  // Fetch shipping rules when method changes
  useEffect(() => {
    const fetchShippingRules = async () => {
      const result = await getShippingRules(cartWeight, selectedMethod);
      if (result.success) {
        setShippingRules(result.allRules);
        setCurrentRule(result.currentRule);

        // Check if weight exceeds maximum allowed weight
        const maxAllowedWeight = result.allRules.length > 0 
          ? Math.max(...result.allRules.map(rule => Number(rule.maxWeight))) 
          : Infinity; // If no rules, allow any weight
          
        if (cartWeight > maxAllowedWeight && maxAllowedWeight !== Infinity) {
          setWeightError(`Weight exceeds maximum allowed weight of ${maxAllowedWeight}kg for ${selectedMethod === 'omniva' ? 'Omniva' : 'international'} shipping delivery method`);
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
            title: 'Error',
            description: result.message || 'Failed to update delivery method',
            variant: 'destructive',
          });
          return;
        }

        // Force a server refresh to get updated cart data
        router.refresh();
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to update delivery method',
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

  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle>Delivery Method</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          <RadioGroup
            value={selectedMethod}
            onValueChange={(value: 'international' | 'omniva') =>
              handleShippingMethodChange(value)
            }
            className='grid grid-cols-2 gap-4'
          >
            <div className='flex items-center space-x-2'>
              <RadioGroupItem value='international' id='international' />
              <Label htmlFor='international' className='flex flex-col'>
                <span className='font-medium'>International Shipping</span>
                <span className='text-sm text-muted-foreground'>
                  Worldwide delivery
                </span>
              </Label>
            </div>
            <div className='flex items-center space-x-2'>
              <RadioGroupItem value='omniva' id='omniva' />
              <Label htmlFor='omniva' className='flex flex-col'>
                <span className='font-medium'>Omniva Pickup</span>
                <span className='text-sm text-muted-foreground'>
                  Local parcel machines
                </span>
              </Label>
            </div>
          </RadioGroup>

          {weightError && (
            <div className='text-red-500 text-sm mt-2'>
              {weightError}
            </div>
          )}

          {showOmnivaSelector && !weightError && (
            <OmnivaLocationSelector />
          )}

          {!weightError && currentRule && (
            <div className='mt-4'>
              <p className='text-sm text-gray-600'>
                Shipping cost: {formatCurrency(Number(currentRule.price))}
              </p>
              <p className='text-xs text-gray-500'>
                For weight: {cartWeight}kg
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
