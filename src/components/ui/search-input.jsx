import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export function SearchInput({ className, ...props }) {
  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
      <Input
        type="search"
        className="pl-8 h-9 w-full md:w-[250px] bg-white"
        {...props}
      />
    </div>
  );
}