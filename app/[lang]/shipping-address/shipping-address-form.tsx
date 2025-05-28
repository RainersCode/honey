'use client';

import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useTransition, useEffect, useState } from 'react';
import { ShippingAddress } from '@/types';
import { shippingAddressSchema } from '@/lib/validators';
import { zodResolver } from '@hookform/resolvers/zod';
import { ControllerRenderProps, useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Plane, MapPin } from 'lucide-react';
import { updateUserAddress } from '@/lib/actions/user.actions';
import { shippingAddressDefaultValues } from '@/lib/constants';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { OmnivaLocationSelector } from '@/components/shared/omniva-location-selector';
import { updateCartDeliveryMethod } from '@/lib/actions/cart.actions';
import { Locale } from '@/config/i18n.config';
import { getDictionary } from '@/lib/dictionary';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { getMyCart } from '@/lib/actions/cart.actions';
import { getActiveCountries } from '@/lib/actions/country.actions';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Flag from 'react-world-flags';

interface Country {
  id: string;
  name: string;
  code: string;
  flag: string;
}

interface ShippingAddressFormProps {
  address: ShippingAddress;
  lang: Locale;
}

// Add CountryFlag component
const CountryFlag = ({ countryCode }: { countryCode: string }) => (
  <div className='inline-block mr-2 w-6 h-4 overflow-hidden rounded-sm border border-gray-200 flex items-center justify-center'>
    <Flag
      code={countryCode}
      fallback={<span className='text-xs'>{countryCode}</span>}
      height='16'
      className='object-cover block'
      style={{ lineHeight: 0 }}
    />
  </div>
);

const ShippingAddressForm = ({ address, lang }: ShippingAddressFormProps) => {
  const router = useRouter();
  const { toast } = useToast();
  const [dict, setDict] = useState<any>(null);
  const [countries, setCountries] = useState<Country[]>([]);
  const [validCountryCodes, setValidCountryCodes] = useState<Set<string>>(
    new Set()
  );
  const [omnivaError, setOmnivaError] = useState(false);

  useEffect(() => {
    const loadDictionary = async () => {
      const dictionary = await getDictionary(lang);
      setDict(dictionary);
    };

    loadDictionary();
  }, [lang]);

  // Load active countries
  useEffect(() => {
    const loadCountries = async () => {
      const result = await getActiveCountries();
      if (result.success) {
        setCountries(result.countries);
        // Create a Set of valid country codes
        setValidCountryCodes(new Set(result.countries.map((c) => c.code)));
      }
    };

    loadCountries();
  }, []);

  // Get cart to sync delivery method
  useEffect(() => {
    const syncCartDeliveryMethod = async () => {
      try {
        const cart = await getMyCart();
        if (cart?.deliveryMethod) {
          form.setValue('deliveryMethod', cart.deliveryMethod);
        }
      } catch (error) {
        console.error('Error syncing cart delivery method:', error);
      }
    };

    syncCartDeliveryMethod();
  }, []);

  const form = useForm<z.infer<typeof shippingAddressSchema>>({
    resolver: zodResolver(shippingAddressSchema),
    defaultValues: address || shippingAddressDefaultValues,
  });

  const [isPending, startTransition] = useTransition();
  const deliveryMethod = form.watch('deliveryMethod');

  // Handle delivery method change
  useEffect(() => {
    if (!deliveryMethod) return;

    const updateDeliveryMethod = async () => {
      const res = await updateCartDeliveryMethod(deliveryMethod);
      if (!res.success) {
        toast({
          variant: 'destructive',
          description: res.message,
        });
      }
    };

    updateDeliveryMethod();
  }, [deliveryMethod, toast]);

  const onSubmit = async (values: z.infer<typeof shippingAddressSchema>) => {
    // Reset error state
    setOmnivaError(false);

    // Validate country selection
    if (
      values.deliveryMethod === 'international' &&
      !validCountryCodes.has(values.country)
    ) {
      toast({
        variant: 'destructive',
        description: 'Selected country is not available for shipping',
      });
      return;
    }

    // Validate Omniva location selection
    if (
      values.deliveryMethod === 'omniva' &&
      (!values.omnivaLocationId || !values.omnivaLocationDetails)
    ) {
      setOmnivaError(true);
      toast({
        variant: 'destructive',
        description:
          dict?.shipping.form.selectOmnivaLocation ||
          'Please select an Omniva pickup location',
      });
      return;
    }

    startTransition(async () => {
      const res = await updateUserAddress(values);

      if (!res.success) {
        toast({
          variant: 'destructive',
          description: res.message,
        });
        return;
      }

      router.push(`/${lang}/place-order`);
    });
  };

  if (!dict) return null;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <Card className='bg-white/90 backdrop-blur-[2px] shadow-md'>
          <CardContent className='pt-6'>
            <div className='space-y-6'>
              {/* Delivery Method */}
              <FormField
                control={form.control}
                name='deliveryMethod'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-[#1D1D1F]'>
                      {dict.shipping.form.deliveryMethod}
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={(value) => {
                          field.onChange(value);
                          // Reset Omniva location and error when switching delivery methods
                          if (value !== 'omniva') {
                            form.setValue('omnivaLocationId', '');
                            form.setValue('omnivaLocationDetails', undefined);
                          }
                          setOmnivaError(false);
                        }}
                        defaultValue={field.value}
                        className='grid grid-cols-2 gap-4'
                      >
                        <FormItem>
                          <FormControl>
                            <RadioGroupItem
                              value='international'
                              className='peer sr-only'
                            />
                          </FormControl>
                          <FormLabel className='flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-[#FF7A3D] [&:has([data-state=checked])]:border-[#FF7A3D] cursor-pointer'>
                            <div className='flex items-center gap-3 w-full'>
                              <div className='flex items-center justify-center w-8 h-8 rounded-full bg-[#FF7A3D]/10'>
                                <Plane className='h-4 w-4 text-[#FF7A3D]' />
                              </div>
                              <div className='flex-1'>
                                <div className='font-medium text-[#1D1D1F]'>
                                  {dict.shipping.form.internationalShipping}
                                </div>
                                <div className='text-xs text-gray-500'>
                                  {dict.shipping.form.internationalDesc || 'Worldwide delivery'}
                                </div>
                              </div>
                            </div>
                          </FormLabel>
                        </FormItem>
                        <FormItem>
                          <FormControl>
                            <RadioGroupItem
                              value='omniva'
                              className='peer sr-only'
                            />
                          </FormControl>
                          <FormLabel className='flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-[#FF7A3D] [&:has([data-state=checked])]:border-[#FF7A3D] cursor-pointer'>
                            <div className='flex items-center gap-3 w-full'>
                              <div className='flex items-center justify-center w-8 h-8 rounded-full bg-[#FF7A3D]/10'>
                                <MapPin className='h-4 w-4 text-[#FF7A3D]' />
                              </div>
                              <div className='flex-1'>
                                <div className='font-medium text-[#1D1D1F]'>
                                  {dict.shipping.form.omnivaPickup}
                                </div>
                                <div className='text-xs text-gray-500'>
                                  {dict.shipping.form.omnivaDesc || 'Local parcel machines'}
                                </div>
                              </div>
                            </div>
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Omniva Location Selector */}
              {deliveryMethod === 'omniva' && (
                <>
                  <FormField
                    control={form.control}
                    name='country'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-[#1D1D1F]'>
                          {dict.shipping.form.country}
                          <span className='text-red-500 ml-1'>*</span>
                        </FormLabel>
                        <Select
                          onValueChange={(value) => {
                            if (!validCountryCodes.has(value)) {
                              toast({
                                variant: 'destructive',
                                description:
                                  'Selected country is not available for shipping',
                              });
                              return;
                            }
                            field.onChange(value);
                          }}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className='border-[#FFE4D2] focus:border-[#FF7A3D] focus:ring-[#FF7A3D]'>
                              <SelectValue
                                placeholder={
                                  dict.shipping.form.countryPlaceholder
                                }
                              >
                                {field.value && (
                                  <div className='flex items-center'>
                                    <CountryFlag countryCode={field.value} />
                                    {
                                      countries.find(
                                        (c) => c.code === field.value
                                      )?.name
                                    }
                                  </div>
                                )}
                              </SelectValue>
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {countries.map((country) => (
                              <SelectItem
                                key={country.code}
                                value={country.code}
                                className='flex items-center'
                              >
                                <CountryFlag countryCode={country.code} />
                                {country.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='omnivaLocationDetails'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-[#1D1D1F] flex items-center'>
                          {dict.shipping.form.omnivaLocation}
                          <span className='text-red-500 ml-1'>*</span>
                        </FormLabel>
                        <FormControl>
                          <OmnivaLocationSelector
                            value={field.value?.id}
                            onSelect={(location) => {
                              field.onChange(location);
                              form.setValue('omnivaLocationId', location.id);
                              setOmnivaError(false);
                            }}
                            error={omnivaError}
                          />
                        </FormControl>
                        <FormMessage className='text-red-500' />
                      </FormItem>
                    )}
                  />
                </>
              )}

              {/* Address Fields */}
              <div className='space-y-4'>
                {/* Full Name */}
                <FormField
                  control={form.control}
                  name='fullName'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-[#1D1D1F]'>
                        {dict.shipping.form.fullName}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={dict.shipping.form.fullNamePlaceholder}
                          {...field}
                          className='border-[#FFE4D2] focus:border-[#FF7A3D] focus:ring-[#FF7A3D]'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Country Selection */}
                {deliveryMethod === 'international' && (
                  <FormField
                    control={form.control}
                    name='country'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-[#1D1D1F]'>
                          {dict.shipping.form.country}
                          <span className='text-red-500 ml-1'>*</span>
                        </FormLabel>
                        <Select
                          onValueChange={(value) => {
                            if (!validCountryCodes.has(value)) {
                              toast({
                                variant: 'destructive',
                                description:
                                  'Selected country is not available for shipping',
                              });
                              return;
                            }
                            field.onChange(value);
                          }}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className='border-[#FFE4D2] focus:border-[#FF7A3D] focus:ring-[#FF7A3D]'>
                              <SelectValue
                                placeholder={
                                  dict.shipping.form.countryPlaceholder
                                }
                              >
                                {field.value && (
                                  <div className='flex items-center'>
                                    <CountryFlag countryCode={field.value} />
                                    {
                                      countries.find(
                                        (c) => c.code === field.value
                                      )?.name
                                    }
                                  </div>
                                )}
                              </SelectValue>
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {countries.map((country) => (
                              <SelectItem
                                key={country.code}
                                value={country.code}
                                className='flex items-center'
                              >
                                <CountryFlag countryCode={country.code} />
                                {country.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {/* Phone Number */}
                <FormField
                  control={form.control}
                  name='phoneNumber'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-[#1D1D1F]'>
                        {dict.shipping.form.phoneNumber}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={
                            dict.shipping.form.phoneNumberPlaceholder
                          }
                          {...field}
                          className='border-[#FFE4D2] focus:border-[#FF7A3D] focus:ring-[#FF7A3D]'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Street Address */}
                <FormField
                  control={form.control}
                  name='streetAddress'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-[#1D1D1F]'>
                        {dict.shipping.form.streetAddress}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={
                            dict.shipping.form.streetAddressPlaceholder
                          }
                          {...field}
                          className='border-[#FFE4D2] focus:border-[#FF7A3D] focus:ring-[#FF7A3D]'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* City */}
                <FormField
                  control={form.control}
                  name='city'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-[#1D1D1F]'>
                        {dict.shipping.form.city}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={dict.shipping.form.cityPlaceholder}
                          {...field}
                          className='border-[#FFE4D2] focus:border-[#FF7A3D] focus:ring-[#FF7A3D]'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Postal Code */}
                <FormField
                  control={form.control}
                  name='postalCode'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-[#1D1D1F]'>
                        {dict.shipping.form.postalCode}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={dict.shipping.form.postalCodePlaceholder}
                          {...field}
                          className='border-[#FFE4D2] focus:border-[#FF7A3D] focus:ring-[#FF7A3D]'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Terms and Privacy Policy */}
              <div className='space-y-4'>
                <FormField
                  control={form.control}
                  name='agreeToTerms'
                  render={({ field }) => (
                    <FormItem className='flex flex-row items-start space-x-3 space-y-0'>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className='text-sm font-normal'>
                        {dict.shipping.form.agreeToTerms}
                      </FormLabel>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='agreeToPrivacyPolicy'
                  render={({ field }) => (
                    <FormItem className='flex flex-row items-start space-x-3 space-y-0'>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className='text-sm font-normal'>
                        {dict.shipping.form.agreeToPrivacy}
                      </FormLabel>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='rememberDetails'
                  render={({ field }) => (
                    <FormItem className='flex flex-row items-start space-x-3 space-y-0'>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className='text-sm font-normal'>
                        {dict.shipping.form.rememberDetails}
                      </FormLabel>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Button
          type='submit'
          className='w-full bg-[#FF7A3D] hover:bg-[#FF7A3D]/90'
          disabled={isPending}
        >
          {isPending ? (
            <LoadingSpinner size="sm" />
          ) : (
            <>
              {dict.shipping.form.submit}
              <ArrowRight className='ml-2 h-4 w-4' />
            </>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default ShippingAddressForm;
