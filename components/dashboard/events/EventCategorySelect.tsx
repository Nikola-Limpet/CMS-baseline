'use client';

import { X, PlusCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Item {
  id: string;
  name: string;
}

const N_A_VALUE = "__N/A__";
const CREATE_NEW_VALUE = "__CREATE_NEW__";

interface EventCategorySelectProps {
  items: Item[];
  selectedItems: string[];
  onSelect: (ids: string[]) => void;
  canAddNew?: boolean;
  onAttemptAddNew?: () => void;
}

export function EventCategorySelect({
  items = [],
  selectedItems = [],
  onSelect,
  canAddNew = false,
  onAttemptAddNew,
}: EventCategorySelectProps) {
  const handleSelect = (value: string) => {
    if (value === CREATE_NEW_VALUE) {
      onAttemptAddNew?.();
      return;
    }
    if (value === N_A_VALUE) {
      onSelect([]);
    } else {
      onSelect([value]);
    }
  };

  const selectValue = selectedItems[0] || N_A_VALUE;

  return (
    <Select value={selectValue} onValueChange={handleSelect}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select category..." />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Categories</SelectLabel>
          <SelectItem value={N_A_VALUE}>N/A (No Category)</SelectItem>
          {items.map((item) => (
            <SelectItem key={item.id} value={item.id}>
              {item.name}
            </SelectItem>
          ))}
          {canAddNew && (
            <SelectItem value={CREATE_NEW_VALUE} className="text-primary italic">
              <PlusCircle className="h-4 w-4 mr-2 inline" /> Create new category...
            </SelectItem>
          )}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
