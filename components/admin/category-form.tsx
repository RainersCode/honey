'use client';

import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { createCategory, updateCategory } from '@/lib/actions/category.actions';
import { Category } from '@prisma/client';
import { UploadButton } from '@/lib/uploadthing';
import { Card, CardContent } from '../ui/card';
import Image from 'next/image';

const categorySchema = z.object({
  key: z.string().min(1).regex(/^[a-z0-9-]+$/, {
    message: 'Only lowercase letters, numbers, and hyphens are allowed',
  }),
  name: z.string().min(1),
  description: z.string().min(1),
  image: z.string().url(),
});

const categoryDefaultValues = {
  key: '',
  name: '',
  description: '',
  image: '',
};

const CategoryForm = ({
  type,
  category,
  categoryId,
  lang,
  dictionary,
}: {
  type: 'Create' | 'Update';
  category?: Category;
  categoryId?: string;
  lang: string;
  dictionary: any;
}) => {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    defaultValues: category || categoryDefaultValues,
  });

  const image = form.watch('image');

  const onSubmit: SubmitHandler<z.infer<typeof categorySchema>> = async (values) => {
    if (type === 'Create') {
      const res = await createCategory(values);

      if (!res.success) {
        toast({
          variant: 'destructive',
          description: res.error,
        });
      } else {
        toast({
          description: 'Category created successfully',
        });
        router.push(`/${lang}/admin/products`);
      }
    }

    if (type === 'Update' && categoryId) {
      const res = await updateCategory({ ...values, id: categoryId });

      if (!res.success) {
        toast({
          variant: 'destructive',
          description: res.error,
        });
      } else {
        toast({
          description: 'Category updated successfully',
        });
        router.push(`/${lang}/admin/products`);
      }
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="key"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{dictionary.admin.categoryKey}</FormLabel>
              <FormControl>
                <Input placeholder="Enter category key" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{dictionary.admin.categoryName}</FormLabel>
              <FormControl>
                <Input placeholder="Enter category name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{dictionary.admin.categoryDescription}</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter category description" 
                  className="resize-none" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{dictionary.admin.categoryImage}</FormLabel>
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col gap-6">
                    {image && (
                      <div className="flex items-center gap-4">
                        <Image
                          src={image}
                          alt="category image"
                          className="w-24 h-24 object-cover object-center rounded-md border"
                          width={96}
                          height={96}
                        />
                        <Input 
                          value={image} 
                          readOnly 
                          className="flex-1"
                        />
                      </div>
                    )}
                    <div className="flex items-center justify-center w-full">
                      <FormControl className="w-full">
                        <div className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <svg className="w-10 h-10 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                            </svg>
                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                              <span className="font-semibold">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG or WEBP (MAX. 4MB)</p>
                          </div>
                          <UploadButton
                            endpoint="imageUploader"
                            onClientUploadComplete={(res) => {
                              if (res?.[0]?.url) {
                                form.setValue('image', res[0].url);
                              }
                            }}
                            onUploadError={(error: Error) => {
                              toast({
                                variant: 'destructive',
                                description: `ERROR! ${error.message}`,
                              });
                            }}
                            appearance={{
                              button: "bg-[#FF7A3D] text-white hover:bg-[#ff6a24] transition-all duration-300 h-10 px-4 py-2 rounded-md",
                              allowedContent: "text-gray-800 dark:text-gray-200",
                              container: "w-full",
                            }}
                          />
                        </div>
                      </FormControl>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">
          {type === 'Create' ? dictionary.admin.create : dictionary.admin.update}
        </Button>
      </form>
    </Form>
  );
}

export default CategoryForm; 