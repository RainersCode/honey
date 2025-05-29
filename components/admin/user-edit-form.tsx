'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateUser } from '@/lib/actions/user.actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowLeft } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { updateUserSchema } from "@/lib/validators";
import { Locale } from '@/config/i18n.config';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface UserEditFormProps {
  user: User;
  lang: Locale;
  dict: any;
}

export default function UserEditForm({ user, lang, dict }: UserEditFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof updateUserSchema>>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });

  const onSubmit = async (data: z.infer<typeof updateUserSchema>) => {
    try {
      setIsLoading(true);
      const result = await updateUser(data);

      if (!result.success) {
        throw new Error(result.message);
      }

      toast({
        title: 'Success',
        description: 'User updated successfully'
      });

      router.refresh();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to update user'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid gap-6">
      <div className="flex justify-start">
        <Button 
          variant="outline"
          size="sm"
          onClick={() => router.push(`/${lang}/admin/users`)}
          className="text-black hover:text-black"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {dict.common.back}
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-black">{dict.common.name}</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter name" 
                    {...field} 
                    className="text-black placeholder:text-gray-400"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-black">{dict.common.email}</FormLabel>
                <FormControl>
                  <Input 
                    type="email" 
                    placeholder="Enter email" 
                    {...field} 
                    className="text-black placeholder:text-gray-400"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="text-black">{dict.common.role}</FormLabel>
                <FormControl>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => field.onChange('user')}
                      className={`flex-1 px-4 py-2 text-sm font-medium rounded-md ${
                        field.value === 'user'
                          ? 'bg-black text-white'
                          : 'bg-white text-black border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      User
                    </button>
                    <button
                      type="button"
                      onClick={() => field.onChange('admin')}
                      className={`flex-1 px-4 py-2 text-sm font-medium rounded-md ${
                        field.value === 'admin'
                          ? 'bg-black text-white'
                          : 'bg-white text-black border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      Admin
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end pt-6">
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-black rounded-md hover:bg-black/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed min-w-[100px]"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  <span>Saving...</span>
                </div>
              ) : (
                <span>Save</span>
              )}
            </button>
          </div>
        </form>
      </Form>
    </div>
  );
} 