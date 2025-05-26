'use client';

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
import { useToast } from '@/hooks/use-toast';
import { updateProfile } from '@/lib/actions/user.actions';
import { updateProfileSchema } from '@/lib/validators';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { getDictionary } from '@/lib/dictionary';
import { Locale } from '@/config/i18n.config';
import { useEffect, useState } from 'react';
import { Loader, Save } from 'lucide-react';

interface ProfileFormProps {
  lang: Locale;
}

const ProfileForm = ({ lang }: ProfileFormProps) => {
  const { data: session, update } = useSession();
  const [dict, setDict] = useState<any>(null);

  useEffect(() => {
    const loadDictionary = async () => {
      const dictionary = await getDictionary(lang);
      setDict(dictionary);
    };

    loadDictionary();
  }, [lang]);

  const form = useForm<z.infer<typeof updateProfileSchema>>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: session?.user?.name ?? '',
      email: session?.user?.email ?? '',
    },
  });

  const { toast } = useToast();

  const onSubmit = async (values: z.infer<typeof updateProfileSchema>) => {
    const res = await updateProfile(values);

    if (!res.success) {
      return toast({
        variant: 'destructive',
        description: res.message,
      });
    }

    const newSession = {
      ...session,
      user: {
        ...session?.user,
        name: values.name,
      },
    };

    await update(newSession);

    toast({
      description: res.message,
    });
  };

  if (!dict) return null;

  return (
    <Form {...form}>
      <form
        className='space-y-6'
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className='space-y-4'>
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#1D1D1F] font-medium">{dict.auth.email}</FormLabel>
                <FormControl>
                  <Input
                    disabled
                    placeholder={dict.contact.form.email.placeholder}
                    className='h-12 border-[#FFE4D2] focus:border-[#FF7A3D] focus:ring-[#FF7A3D] bg-white/50'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#1D1D1F] font-medium">{dict.auth.fullName}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={dict.contact.form.name.placeholder}
                    className='h-12 border-[#FFE4D2] focus:border-[#FF7A3D] focus:ring-[#FF7A3D] bg-white/50'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button
          type='submit'
          size='lg'
          className='w-full bg-[#FF7A3D] hover:bg-[#ff6a24] text-white font-medium h-12'
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? (
            <div className='flex items-center justify-center'>
              <Loader className='w-5 h-5 animate-spin mr-2' />
              <span>{dict.common.loading}</span>
            </div>
          ) : (
            <div className='flex items-center justify-center'>
              <Save className='w-5 h-5 mr-2' />
              <span>{dict.user.updateProfile}</span>
            </div>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default ProfileForm; 