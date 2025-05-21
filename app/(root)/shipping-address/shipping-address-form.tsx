'use client';

import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useTransition } from 'react';
import { ShippingAddress } from '@/types';
import { shippingAddressSchema } from '@/lib/validators';
import { zodResolver } from '@hookform/resolvers/zod';
import { ControllerRenderProps, useForm, SubmitHandler } from 'react-hook-form';
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
import { ArrowRight, Loader, MapPin } from 'lucide-react';
import { updateUserAddress } from '@/lib/actions/user.actions';
import { shippingAddressDefaultValues } from '@/lib/constants';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';

const ShippingAddressForm = ({ address }: { address: ShippingAddress }) => {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof shippingAddressSchema>>({
    resolver: zodResolver(shippingAddressSchema),
    defaultValues: address || shippingAddressDefaultValues,
  });

  const [isPending, startTransition] = useTransition();

  const onSubmit: SubmitHandler<z.infer<typeof shippingAddressSchema>> = async (
    values
  ) => {
    startTransition(async () => {
      const res = await updateUserAddress(values);

      if (!res.success) {
        toast({
          variant: 'destructive',
          description: res.message,
        });
        return;
      }

      router.push('/payment-method');
    });
  };

  return (
    <div className="wrapper py-8">
      <Card className="max-w-2xl mx-auto bg-white/90 backdrop-blur-[2px] shadow-md hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="space-y-2 border-b border-[#FFE4D2] pb-6">
          <div className="flex items-center gap-2 text-[#FF7A3D]">
            <MapPin className="w-5 h-5" />
            <CardTitle className="text-2xl font-serif">Shipping Address</CardTitle>
          </div>
          <CardDescription>
            Please enter the address where you'd like your honey products delivered
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Form {...form}>
            <form
              method="post"
              className="space-y-6"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="fullName"
                render={({
                  field,
                }: {
                  field: ControllerRenderProps<
                    z.infer<typeof shippingAddressSchema>,
                    'fullName'
                  >;
                }) => (
                  <FormItem>
                    <FormLabel className="text-[#1D1D1F]">Full Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter full name" 
                        {...field}
                        className="border-[#FFE4D2] focus:border-[#FF7A3D] focus:ring-[#FF7A3D]" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="streetAddress"
                render={({
                  field,
                }: {
                  field: ControllerRenderProps<
                    z.infer<typeof shippingAddressSchema>,
                    'streetAddress'
                  >;
                }) => (
                  <FormItem>
                    <FormLabel className="text-[#1D1D1F]">Street Address</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter street address" 
                        {...field}
                        className="border-[#FFE4D2] focus:border-[#FF7A3D] focus:ring-[#FF7A3D]" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="city"
                  render={({
                    field,
                  }: {
                    field: ControllerRenderProps<
                      z.infer<typeof shippingAddressSchema>,
                      'city'
                    >;
                  }) => (
                    <FormItem>
                      <FormLabel className="text-[#1D1D1F]">City</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter city" 
                          {...field}
                          className="border-[#FFE4D2] focus:border-[#FF7A3D] focus:ring-[#FF7A3D]" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="postalCode"
                  render={({
                    field,
                  }: {
                    field: ControllerRenderProps<
                      z.infer<typeof shippingAddressSchema>,
                      'postalCode'
                    >;
                  }) => (
                    <FormItem>
                      <FormLabel className="text-[#1D1D1F]">Postal Code</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter postal code" 
                          {...field}
                          className="border-[#FFE4D2] focus:border-[#FF7A3D] focus:ring-[#FF7A3D]" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="country"
                  render={({
                    field,
                  }: {
                    field: ControllerRenderProps<
                      z.infer<typeof shippingAddressSchema>,
                      'country'
                    >;
                  }) => (
                    <FormItem>
                      <FormLabel className="text-[#1D1D1F]">Country</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter country" 
                          {...field}
                          className="border-[#FFE4D2] focus:border-[#FF7A3D] focus:ring-[#FF7A3D]" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({
                    field,
                  }: {
                    field: ControllerRenderProps<
                      z.infer<typeof shippingAddressSchema>,
                      'phoneNumber'
                    >;
                  }) => (
                    <FormItem>
                      <FormLabel className="text-[#1D1D1F]">Phone Number</FormLabel>
                      <FormControl>
                        <Input 
                          type="tel"
                          placeholder="Enter phone number" 
                          {...field}
                          className="border-[#FFE4D2] focus:border-[#FF7A3D] focus:ring-[#FF7A3D]" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="agreeToTerms"
                  render={({
                    field,
                  }: {
                    field: ControllerRenderProps<
                      z.infer<typeof shippingAddressSchema>,
                      'agreeToTerms'
                    >;
                  }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="border-2 border-[#FFBF8A] data-[state=checked]:bg-[#FF7A3D] data-[state=checked]:text-white"
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal">
                        I have read and agree to the Distance Contract
                      </FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="agreeToPrivacyPolicy"
                  render={({
                    field,
                  }: {
                    field: ControllerRenderProps<
                      z.infer<typeof shippingAddressSchema>,
                      'agreeToPrivacyPolicy'
                    >;
                  }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="border-2 border-[#FFBF8A] data-[state=checked]:bg-[#FF7A3D] data-[state=checked]:text-white"
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal">
                        I agree to the terms of use and privacy policy
                      </FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="rememberDetails"
                  render={({
                    field,
                  }: {
                    field: ControllerRenderProps<
                      z.infer<typeof shippingAddressSchema>,
                      'rememberDetails'
                    >;
                  }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="border-2 border-[#FFBF8A] data-[state=checked]:bg-[#FF7A3D] data-[state=checked]:text-white"
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal">
                        Remember my data on this device
                      </FormLabel>
                    </FormItem>
                  )}
                />
              </div>

              <div className="pt-4">
                <Button 
                  type="submit" 
                  disabled={isPending}
                  className="w-full md:w-auto bg-[#FF7A3D] hover:bg-[#ff6a24] text-white"
                >
                  {isPending ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Continue to Payment
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ShippingAddressForm;
