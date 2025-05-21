'use client';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useTransition } from 'react';
import { paymentMethodSchema } from '@/lib/validators';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { DEFAULT_PAYMENT_METHOD, PAYMENT_METHODS } from '@/lib/constants';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { ArrowRight, CreditCard, Loader } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { updateUserPaymentMethod } from '@/lib/actions/user.actions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const PaymentMethodForm = ({
  preferredPaymentMethod,
}: {
  preferredPaymentMethod: string | null;
}) => {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof paymentMethodSchema>>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: {
      type: preferredPaymentMethod || DEFAULT_PAYMENT_METHOD,
    },
  });

  const [isPending, startTransition] = useTransition();

  const onSubmit = async (values: z.infer<typeof paymentMethodSchema>) => {
    startTransition(async () => {
      const res = await updateUserPaymentMethod(values);

      if (!res.success) {
        toast({
          variant: 'destructive',
          description: res.message,
        });
        return;
      }

      router.push('/place-order');
    });
  };

  const getPaymentIcon = (method: string) => {
    switch (method) {
      case 'PayPal':
        return '💳';
      case 'Stripe':
        return '💳';
      case 'CashOnDelivery':
        return '💵';
      default:
        return '💳';
    }
  };

  return (
    <div className="wrapper py-8">
      <Card className="max-w-2xl mx-auto bg-white/90 backdrop-blur-[2px] shadow-md hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="space-y-2 border-b border-[#FFE4D2] pb-6">
          <div className="flex items-center gap-2 text-[#FF7A3D]">
            <CreditCard className="w-5 h-5" />
            <CardTitle className="text-2xl font-serif">Payment Method</CardTitle>
          </div>
          <CardDescription>
            Choose your preferred payment method for your honey products
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
                name="type"
                render={({ field }) => (
                  <FormItem className="space-y-4">
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex flex-col space-y-3"
                      >
                        {PAYMENT_METHODS.map((paymentMethod) => (
                          <label
                            key={paymentMethod}
                            className={`flex items-center space-x-3 space-y-0 rounded-lg border border-[#FFE4D2] p-4 cursor-pointer transition-colors duration-200 ${
                              field.value === paymentMethod
                                ? 'bg-[#FFF5EE] border-[#FF7A3D]'
                                : 'hover:bg-[#FFF5EE]/50'
                            }`}
                          >
                            <FormControl>
                              <RadioGroupItem
                                value={paymentMethod}
                                className="border-[#FFE4D2] text-[#FF7A3D]"
                              />
                            </FormControl>
                            <span className="flex items-center gap-2 cursor-pointer font-medium text-[#1D1D1F]">
                              <span>{getPaymentIcon(paymentMethod)}</span>
                              {paymentMethod}
                            </span>
                          </label>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                      Continue to Place Order
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

export default PaymentMethodForm;
