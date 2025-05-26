'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { reviewFormDefaultValues } from '@/lib/constants';
import { insertReviewSchema } from '@/lib/validators';
import { zodResolver } from '@hookform/resolvers/zod';
import { StarIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  createUpdateReview,
  getReviewByProductId,
} from '@/lib/actions/review.actions';
import { Separator } from '@/components/ui/separator';
import { Locale } from '@/config/i18n.config';
import { getDictionary } from '@/lib/dictionary';

interface ReviewFormProps {
  userId: string;
  productId: string;
  onReviewSubmitted: () => void;
  lang: Locale;
}

const ReviewForm = ({
  userId,
  productId,
  onReviewSubmitted,
  lang,
}: ReviewFormProps) => {
  const [open, setOpen] = useState(false);
  const [dict, setDict] = useState<any>(null);

  const { toast } = useToast();

  const form = useForm<z.infer<typeof insertReviewSchema>>({
    resolver: zodResolver(insertReviewSchema),
    defaultValues: reviewFormDefaultValues,
  });

  useEffect(() => {
    const loadDictionary = async () => {
      const dictionary = await getDictionary(lang);
      setDict(dictionary);
    };

    loadDictionary();
  }, [lang]);

  // Open Form Handler
  const handleOpenForm = async () => {
    form.setValue('productId', productId);
    form.setValue('userId', userId);

    const review = await getReviewByProductId({ productId });

    if (review) {
      form.setValue('title', review.title);
      form.setValue('description', review.description);
      form.setValue('rating', review.rating);
    }

    setOpen(true);
  };

  // Submit Form Handler
  const onSubmit: SubmitHandler<z.infer<typeof insertReviewSchema>> = async (
    values
  ) => {
    const res = await createUpdateReview({ ...values, productId });

    if (!res.success) {
      return toast({
        variant: 'destructive',
        title: 'error',
        description: res.message,
      });
    }

    setOpen(false);

    onReviewSubmitted();

    toast({
      title: 'success',
      description: res.message,
    });
  };

  if (!dict) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button 
        onClick={handleOpenForm} 
        variant='outline'
        className="bg-white hover:bg-[#FF7A3D]/5 border-[#FF7A3D] text-[#FF7A3D] hover:text-[#FF7A3D] hover:border-[#FF7A3D] transition-colors duration-300"
      >
        {dict.reviews.writeReview}
      </Button>
      <DialogContent className='sm:max-w-[500px] p-0 border-[#FF7A3D]/10'>
        <Form {...form}>
          <form method='post' onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader className="p-6 pb-4 border-b border-[#FF7A3D]/10">
              <DialogTitle className="text-2xl font-serif text-[#1D1D1F]">{dict.reviews.writeReview}</DialogTitle>
              <DialogDescription className="text-[#1D1D1F]/70">
                {dict.reviews.shareThoughts}
              </DialogDescription>
            </DialogHeader>
            <div className='p-6 space-y-6'>
              <FormField
                control={form.control}
                name='rating'
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel className="text-[#1D1D1F] font-medium">{dict.reviews.rating}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value.toString()}
                      >
                        <FormControl>
                          <SelectTrigger className="border-gray-200 focus:ring-[#FF7A3D]/20 focus-visible:ring-[#FF7A3D]/20">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Array.from({ length: 5 }).map((_, index) => (
                            <SelectItem
                              key={index}
                              value={(index + 1).toString()}
                              className="hover:bg-[#FF7A3D]/5 focus:bg-[#FF7A3D]/5"
                            >
                              <div className="flex items-center gap-2">
                                <span>{index + 1}</span>
                                <StarIcon className='h-4 w-4 text-[#FF7A3D]' />
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name='title'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#1D1D1F] font-medium">{dict.reviews.title}</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder={dict.reviews.titlePlaceholder}
                        className="border-gray-200 focus-visible:ring-[#FF7A3D]/20" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='description'
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel className="text-[#1D1D1F] font-medium">{dict.reviews.review}</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder={dict.reviews.reviewPlaceholder}
                          className="min-h-[120px] border-gray-200 focus-visible:ring-[#FF7A3D]/20" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>
            <DialogFooter className="p-6 pt-4 border-t border-[#FF7A3D]/10">
              <Button 
                type="submit" 
                className="bg-[#FF7A3D] hover:bg-[#FF7A3D]/90 text-white"
              >
                {dict.reviews.submitReview}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewForm; 