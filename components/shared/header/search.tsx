import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getAllCategories } from '@/lib/actions/category.actions';
import { SearchIcon } from 'lucide-react';

const Search = async () => {
  const categories = await getAllCategories();

  return (
    <form action='/search' method='GET' className='w-full'>
      <div className='flex w-full items-center gap-2'>
        <Select name='category'>
          <SelectTrigger className='w-[140px] bg-white/50 border-amber-200 focus:ring-amber-200'>
            <SelectValue placeholder='All Categories' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem key='All' value='all'>
              All Categories
            </SelectItem>
            {categories.map((x) => (
              <SelectItem key={x.key} value={x.key}>
                {x.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className='flex-1 relative'>
          <Input
            name='q'
            type='text'
            placeholder='Search honey products...'
            className='w-full bg-white/50 border-amber-200 focus-visible:ring-amber-200 pr-12'
          />
          <Button 
            type='submit'
            size='icon'
            className='absolute right-1 top-1/2 -translate-y-1/2 hover:bg-amber-100'
          >
            <SearchIcon className='h-4 w-4' />
          </Button>
        </div>
      </div>
    </form>
  );
};

export default Search;
