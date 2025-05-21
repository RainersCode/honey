'use client';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useTransition } from 'react';
import { paymentMethodSchema } from '@/lib/validators';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { DEFAULT_PAYMENT_METHOD } from '@/lib/constants';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { ArrowRight, CreditCard, Loader } from 'lucide-react';
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
      type: DEFAULT_PAYMENT_METHOD,
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

  return (
    <div className="wrapper py-8">
      <Card className="max-w-2xl mx-auto bg-white/90 backdrop-blur-[2px] shadow-md hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="space-y-2 border-b border-[#FFE4D2] pb-6">
          <div className="flex items-center gap-2 text-[#FF7A3D]">
            <CreditCard className="w-5 h-5" />
            <CardTitle className="text-2xl font-serif">Payment Method</CardTitle>
          </div>
          <CardDescription>
            Your payment will be processed securely through Stripe
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="flex items-center space-x-3 rounded-lg border border-[#FFE4D2] p-4 bg-[#FFF5EE] border-[#FF7A3D]">
                <span className="flex items-center gap-2 font-medium text-[#1D1D1F]">
                  <span>💳</span>
                  Stripe
                </span>
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
