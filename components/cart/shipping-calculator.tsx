'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { OmnivaLocationSelector } from '@/components/shared/omniva-location-selector';
import { updateCartDeliveryMethod } from '@/lib/actions/cart.actions';
import { INTERNATIONAL_SHIPPING_RATES } from '@/lib/constants';

interface ShippingCalculatorProps {
  cartWeight: number;
  onRateSelect: (rate: { service: string; rate: number }) => void;
}

export default function ShippingCalculator({ cartWeight, onRateSelect }: ShippingCalculatorProps) {
  const [selectedMethod, setSelectedMethod] = useState<'international' | 'omniva'>('international');
  const [showOmnivaSelector, setShowOmnivaSelector] = useState(false);
  const { toast } = useToast();

  const calculateInternationalRate = (weight: number) => {
    if (weight <= INTERNATIONAL_SHIPPING_RATES.LIGHT.maxWeight) {
      return INTERNATIONAL_SHIPPING_RATES.LIGHT.price;
    } else if (weight <= INTERNATIONAL_SHIPPING_RATES.MEDIUM.maxWeight) {
      return INTERNATIONAL_SHIPPING_RATES.MEDIUM.price;
    } else {
      const extraWeight = Math.ceil(weight - INTERNATIONAL_SHIPPING_RATES.MEDIUM.maxWeight);
      return INTERNATIONAL_SHIPPING_RATES.MEDIUM.price + (extraWeight * 2);
    }
  };

  const handleShippingMethodChange = async (method: 'international' | 'omniva') => {
    // First, calculate and update the rate before changing the method
    const newRate = method === 'omniva' 
      ? { service: 'Omniva Pickup', rate: 3.10 }
      : { service: 'International Shipping', rate: calculateInternationalRate(cartWeight) };
    
    // Update the rate immediately
    onRateSelect(newRate);
    
    // Then update the UI state
    setSelectedMethod(method);
    setShowOmnivaSelector(method === 'omniva');
    
    try {
      const result = await updateCartDeliveryMethod(method);
      
      if (!result.success) {
        toast({
          title: "Error",
          description: "Failed to update delivery method",
          variant: "destructive",
        });
        return;
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
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <p className="text-sm font-medium">Shipping Cost Breakdown:</p>
              <p className="text-sm text-muted-foreground">
                Package Weight: {cartWeight.toFixed(2)} kg<br />
                {cartWeight <= INTERNATIONAL_SHIPPING_RATES.LIGHT.maxWeight && 
                  `Light Package (up to ${INTERNATIONAL_SHIPPING_RATES.LIGHT.maxWeight}kg): €${INTERNATIONAL_SHIPPING_RATES.LIGHT.price}`}
                {cartWeight > INTERNATIONAL_SHIPPING_RATES.LIGHT.maxWeight && cartWeight <= INTERNATIONAL_SHIPPING_RATES.MEDIUM.maxWeight && 
                  `Medium Package (${INTERNATIONAL_SHIPPING_RATES.LIGHT.maxWeight}kg - ${INTERNATIONAL_SHIPPING_RATES.MEDIUM.maxWeight}kg): €${INTERNATIONAL_SHIPPING_RATES.MEDIUM.price}`}
                {cartWeight > INTERNATIONAL_SHIPPING_RATES.MEDIUM.maxWeight && 
                  `Heavy Package (over ${INTERNATIONAL_SHIPPING_RATES.MEDIUM.maxWeight}kg): €${calculateInternationalRate(cartWeight)}`}
              </p>
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