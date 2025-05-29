import { getDictionary } from '@/lib/dictionary';
import { Locale } from '@/config/i18n.config';
import { requireAdmin } from '@/lib/auth-guard';
import { getAllUsers } from '@/lib/actions/user.actions';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatId } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { UserTableActions } from '@/components/admin/user-table-actions';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default async function AdminUsersPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: Locale }>;
  searchParams: Promise<{ page?: string; query?: string }>;
}) {
  await requireAdmin();
  const { lang } = await params;
  const dict = await getDictionary(lang) as any;
  const searchParamsResolved = await searchParams;
  const { page = '1', query: searchText = '' } = searchParamsResolved;

  const users = await getAllUsers({ page: Number(page), query: searchText });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{dict.admin.users}</h1>
        {searchText && (
          <div className="flex items-center gap-2">
            <span>Filtered by &ldquo;{searchText}&rdquo;</span>
            <Button asChild variant="outline" size="sm">
              <Link href={`/${lang}/admin/users`}>Clear Filter</Link>
            </Button>
          </div>
        )}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.data.map((user: User) => (
              <TableRow key={user.id}>
                <TableCell>{formatId(user.id)}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {user.role === 'user' ? (
                    <Badge variant="secondary">User</Badge>
                  ) : (
                    <Badge>Admin</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/${lang}/admin/users/${user.id}`}>Edit</Link>
                    </Button>
                    <UserTableActions userId={user.id} />
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