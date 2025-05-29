'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Category } from '@prisma/client';
import { createCategory, updateCategory, deleteCategory } from '@/lib/actions/category.actions';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface CategoryManagementProps {
  categories: (Category & {
    _count: {
      products: number;
    };
  })[];
  dictionary: any;
}

export default function CategoryManagement({ categories, dictionary }: CategoryManagementProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const { toast } = useToast();
  const pathname = usePathname();
  const lang = pathname.split('/')[1];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      key: formData.get('key') as string,
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      image: formData.get('image') as string,
    };

    try {
      if (editingCategory) {
        await updateCategory({ id: editingCategory.id, ...data });
        toast({
          description: 'Category updated successfully',
          variant: 'success',
        });
        setIsOpen(false);
        setEditingCategory(null);
      } else {
        await createCategory(data);
        toast({
          description: 'Category created successfully',
          variant: 'success',
        });
        setIsOpen(false);
      }
    } catch (error) {
      toast({
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = async (category: Category & { _count: { products: number } }) => {
    setEditingCategory(category);
    setIsOpen(true);
  };

  const handleDelete = async (category: Category & { _count: { products: number } }) => {
    if (category._count.products > 0) {
      toast({
        description: 'Cannot delete category with existing products',
        variant: 'destructive',
      });
      return;
    }

    try {
      await deleteCategory(category.id);
      toast({
        description: 'Category deleted successfully',
        variant: 'success',
      });
    } catch (error) {
      toast({
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold">{dictionary.admin.categories}</h1>
        </div>
        <Button asChild>
          <Link href={`/${lang}/admin/categories/create`}>{dictionary.admin.createCategory}</Link>
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{dictionary.admin.categoryName}</TableHead>
              <TableHead>{dictionary.admin.categoryKey}</TableHead>
              <TableHead>{dictionary.admin.categoryDescription}</TableHead>
              <TableHead className="text-right">{dictionary.admin.products}</TableHead>
              <TableHead className="text-right">{dictionary.admin.actions}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>{category.name}</TableCell>
                <TableCell>{category.key}</TableCell>
                <TableCell>{category.description}</TableCell>
                <TableCell className="text-right">{category._count.products}</TableCell>
                <TableCell className="text-right">
                  <div className="space-x-2">
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/${lang}/admin/categories/${category.id}`}>{dictionary.admin.editCategory}</Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(category)}
                      disabled={category._count.products > 0}
                    >
                      {dictionary.admin.deleteCategory}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 