'use client';

import { Button } from '@/components/ui/button';
import { deleteProduct } from '@/lib/actions/product.actions';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface ProductActionsProps {
  productId: string;
  lang: string;
}

export default function ProductActions({ productId, lang }: ProductActionsProps) {
  const { toast } = useToast();
  const router = useRouter();

  const handleDelete = async () => {
    try {
      await deleteProduct(productId);
      toast({
        description: 'Product deleted successfully',
        variant: 'success',
      });
      router.refresh();
    } catch (error) {
      toast({
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-x-2">
      <Button 
        variant="ghost" 
        size="sm"
        className="hover:bg-accent"
        asChild
      >
        <Link href={`/${lang}/admin/products/${productId}`}>
          Edit
        </Link>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="hover:bg-accent"
        onClick={handleDelete}
      >
        Delete
      </Button>
    </div>
  );
} 