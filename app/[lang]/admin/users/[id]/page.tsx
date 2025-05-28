'use client';

import { getDictionary } from '@/lib/dictionary';
import { Locale } from '@/config/i18n.config';
import { getUserById, updateUser } from '@/lib/actions/user.actions';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { notFound, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
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

interface PageProps {
  params: { 
    lang: Locale; 
    id: string;
  };
}

export default function AdminUserDetailsPage({ params: { lang, id } }: PageProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const [dict, setDict] = useState<any>(null);

  const form = useForm<z.infer<typeof updateUserSchema>>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      id: '',
      name: '',
      email: '',
      role: 'user'
    }
  });

  // Load user data and dictionary
  useEffect(() => {
    const loadData = async () => {
      try {
        const [userResponse, dictionary] = await Promise.all([
          getUserById(id),
          getDictionary(lang)
        ]);
        
        if (!userResponse) {
          notFound();
        }
        
        form.reset({
          id: userResponse.id,
          name: userResponse.name,
          email: userResponse.email,
          role: userResponse.role
        });
        setDict(dictionary);
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to load user data'
        });
        router.push(`/${lang}/admin/users`);
      }
    };

    loadData();
  }, [id, lang, form]);

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
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to update user'
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!dict) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight text-black">
            {dict.admin.editUser}
          </h2>
          <p className="text-sm text-gray-500">
            {dict.admin.userDetails}
          </p>
        </div>
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

      <div className="grid gap-6">
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
    </div>
  );
} 