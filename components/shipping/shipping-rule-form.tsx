'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import {
  createShippingRule,
  updateShippingRule,
} from '@/lib/actions/shipping.actions';
import { Locale } from '@/config/i18n.config';

const formSchema = z
  .object({
    zone: z.string().min(1, 'Zone is required'),
    minWeight: z.string().transform((val) => Number(val)),
    maxWeight: z.string().transform((val) => Number(val)),
    price: z.string().transform((val) => Number(val)),
  })
  .refine((data) => Number(data.maxWeight) > Number(data.minWeight), {
    message: 'Maximum weight must be greater than minimum weight',
    path: ['maxWeight'],
  });

type FormData = z.infer<typeof formSchema>;

interface ShippingRuleFormProps {
  type: 'Create' | 'Update';
  rule?: {
    id: string;
    zone: string;
    minWeight: number;
    maxWeight: number;
    price: number;
  };
  lang: Locale;
}

export default function ShippingRuleForm({
  type,
  rule,
  lang,
}: ShippingRuleFormProps) {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      zone: rule?.zone || '',
      minWeight: rule?.minWeight?.toString() || '',
      maxWeight: rule?.maxWeight?.toString() || '',
      price: rule?.price?.toString() || '',
    },
  });

  async function onSubmit(data: FormData) {
    try {
      const action =
        type === 'Create' ? createShippingRule : updateShippingRule;
      const result = await (type === 'Create'
        ? action({ ...data, carrier: 'standard' })
        : action(rule!.id, { ...data, carrier: 'standard' }));

      if (!result.success) {
        toast({
          title: 'Error',
          description: result.error,
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: 'Success',
        description: `Shipping rule ${type === 'Create' ? 'created' : 'updated'} successfully`,
      });

      router.push(`/${lang}/admin/shipping`);
      router.refresh();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Something went wrong',
        variant: 'destructive',
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <FormField
          control={form.control}
          name='zone'
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Shipping Zone</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="international" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      International
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="omniva" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Omniva
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='minWeight'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Starting Weight (kg)</FormLabel>
              <FormControl>
                <Input type='number' step='0.01' {...field} />
              </FormControl>
              <p className="text-sm text-gray-500">
                Minimum weight for this shipping rate to apply
              </p>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='maxWeight'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Maximum Weight Limit (kg)</FormLabel>
              <FormControl>
                <Input type='number' step='0.01' {...field} />
              </FormControl>
              <p className="text-sm text-gray-500">
                Maximum allowed weight for this shipping method. Orders exceeding this weight will not be allowed.
              </p>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='price'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price (€)</FormLabel>
              <FormControl>
                <Input type='number' step='0.01' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='flex gap-4'>
          <Button type='submit'>{type} Rule</Button>
          <Button
            type='button'
            variant='outline'
            onClick={() => router.push(`/${lang}/admin/shipping`)}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
