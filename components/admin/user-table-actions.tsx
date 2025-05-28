'use client';

import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { deleteUser } from '@/lib/actions/user.actions';

interface UserTableActionsProps {
  userId: string;
}

export function UserTableActions({ userId }: UserTableActionsProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const result = await deleteUser(userId);

      if (!result.success) {
        throw new Error(result.message);
      }

      toast({
        description: result.message,
      });
      router.refresh();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        description: error.message || 'Failed to delete user',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Button
      variant="destructive"
      size="sm"
      onClick={handleDelete}
      disabled={isDeleting}
    >
      {isDeleting ? 'Deleting...' : 'Delete'}
    </Button>
  );
} 