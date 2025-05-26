'use client';

import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useTransition, useEffect, useState } from 'react';
import { paymentMethodSchema } from '@/lib/validators';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { ArrowRight, CreditCard } from 'lucide-react';
import { updateUserPaymentMethod } from '@/lib/actions/user.actions';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Locale } from '@/config/i18n.config';
import { getDictionary } from '@/lib/dictionary';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { PAYMENT_METHODS } from '@/lib/constants';

interface PaymentMethodFormProps {
  paymentMethod?: string;
  lang: Locale;
}

const PaymentMethodForm = ({ paymentMethod = 'Stripe', lang }: PaymentMethodFormProps) => {
  const router = useRouter();
  const { toast } = useToast();
  const [dict, setDict] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDictionary = async () => {
      try {
        const dictionary = await getDictionary(lang);
        setDict(dictionary);
      } finally {
        setIsLoading(false);
      }
    };

    loadDictionary();
  }, [lang]);

  const form = useForm<z.infer<typeof paymentMethodSchema>>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: {
      type: paymentMethod || 'Stripe',
    },
  });

  const [isPending, startTransition] = useTransition();

  const onSubmit = async (values: z.infer<typeof paymentMethodSchema>) => {
    startTransition(async () => {
      try {
        const res = await updateUserPaymentMethod(values);

        if (!res.success) {
          toast({
            variant: 'destructive',
            description: res.message,
          });
          return;
        }

        router.push(`/${lang}/place-order`);
      } catch (error) {
        toast({
          variant: 'destructive',
          description: dict?.payment?.form?.errors?.update || 'Failed to update payment method',
        });
      }
    });
  };

  if (isLoading || !dict) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card className="bg-white/90 backdrop-blur-[2px] shadow-md">
          <CardContent className="pt-6">
            <div className="space-y-6">
              {/* Payment Method Selection */}
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#1D1D1F]">{dict.payment.form.method}</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="grid grid-cols-1 gap-4"
                      >
                        {PAYMENT_METHODS.map((method) => (
                          <FormItem key={method}>
                            <FormControl>
                              <RadioGroupItem
                                value={method}
                                className="peer sr-only"
                              />
                            </FormControl>
                            <FormLabel className="flex items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-[#FF7A3D] [&:has([data-state=checked])]:border-[#FF7A3D] cursor-pointer">
                              <div className="flex items-center gap-3">
                                <CreditCard className="h-5 w-5 text-[#FF7A3D]" />
                                <div>
                                  <p className="font-medium">{method}</p>
                                  <p className="text-sm text-gray-600">{dict.payment.form[method.toLowerCase()]}</p>
                                </div>
                              </div>
                            </FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Payment Terms */}
              <div className="text-sm text-gray-600">
                <p>{dict.payment.form.securePayment}</p>
                <p className="mt-2">{dict.payment.form.termsNotice}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button
          type="submit"
          className="w-full bg-[#FF7A3D] text-white hover:bg-[#ff6a2a] transition-all duration-300"
          disabled={isPending}
        >
          {isPending ? (
            <LoadingSpinner size="sm" />
          ) : (
            <>
              {dict.payment.form.submit}
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default PaymentMethodForm; 