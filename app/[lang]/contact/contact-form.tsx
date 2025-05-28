'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
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
import { Textarea } from '@/components/ui/textarea';
import { Locale } from '@/config/i18n.config';
import { getDictionary } from '@/lib/dictionary';
import { sendContactForm } from '@/lib/actions/contact.actions';

const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const defaultValues: ContactFormValues = {
  name: '',
  email: '',
  subject: '',
  message: '',
};

interface ContactFormProps {
  lang: Locale;
}

const ContactForm = ({ lang }: ContactFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dict, setDict] = useState<any>(null);

  useEffect(() => {
    const loadDictionary = async () => {
      const dictionary = await getDictionary(lang);
      setDict(dictionary);
    };

    loadDictionary();
  }, [lang]);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues,
  });

  const onSubmit = async (data: ContactFormValues) => {
    if (!dict) return;
    
    setIsSubmitting(true);
    try {
      const result = await sendContactForm(data);
      
      if (result.success) {
        toast({
          title: 'Success',
          description: dict.contact.form.success,
        });
        form.reset();
      } else {
        toast({
          title: 'Error',
          description: dict.contact.form.error,
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Form submission error:', error);
      toast({
        title: 'Error',
        description: dict.contact.form.error,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!dict) return null;

  return (
    <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
      <h2 className="text-2xl font-serif text-[#1D1D1F] mb-6">{dict.contact.form.title}</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#1D1D1F]">{dict.contact.form.name.label}</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder={dict.contact.form.name.placeholder}
                      className="focus-visible:ring-[#FF7A3D]" 
                      {...field} 
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
                  <FormLabel className="text-[#1D1D1F]">{dict.contact.form.email.label}</FormLabel>
                  <FormControl>
                    <Input 
                      type="email" 
                      placeholder={dict.contact.form.email.placeholder}
                      className="focus-visible:ring-[#FF7A3D]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#1D1D1F]">{dict.contact.form.subject.label}</FormLabel>
                <FormControl>
                  <Input 
                    placeholder={dict.contact.form.subject.placeholder}
                    className="focus-visible:ring-[#FF7A3D]" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#1D1D1F]">{dict.contact.form.message.label}</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder={dict.contact.form.message.placeholder}
                    className="min-h-[150px] resize-none focus-visible:ring-[#FF7A3D]"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            className="w-full md:w-auto bg-[#FF7A3D] hover:bg-[#E86A2D] text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {dict.contact.form.sending}
              </>
            ) : (
              dict.contact.form.submit
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ContactForm; 