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
import LoadingSpinner from '@/components/ui/loading-spinner';

const ProfileForm = () => {
  const { data: session, update } = useSession();

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

  return (
    <Form {...form}>
      <form
        className='flex flex-col gap-6'
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className='flex flex-col gap-4'>
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel className='text-[#1D1D1F] font-medium'>Email</FormLabel>
                <FormControl>
                  <Input
                    disabled
                    placeholder='Email'
                    className='bg-white/50 border-[#FFE4D2] focus-visible:ring-[#FF7A3D] disabled:opacity-70'
                    {...field}
                  />
                </FormControl>
                <FormMessage className='text-[#FF7A3D]' />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel className='text-[#1D1D1F] font-medium'>Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Name'
                    className='bg-white/50 border-[#FFE4D2] focus-visible:ring-[#FF7A3D]'
                    {...field}
                  />
                </FormControl>
                <FormMessage className='text-[#FF7A3D]' />
              </FormItem>
            )}
          />
        </div>
        <Button
          type='submit'
          className='w-full bg-[#FF7A3D] text-white hover:bg-[#ff6a2a] transition-all duration-300'
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? (
            <>
              <LoadingSpinner size="sm" className="mr-2" />
              Updating...
            </>
          ) : (
            'Update Profile'
          )}
        </Button>
      </form>
    </Form>
  );
};

export default ProfileForm;
