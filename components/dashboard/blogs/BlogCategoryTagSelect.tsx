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

interface BlogCategoryTagSelectProps {
  type: 'category' | 'tag';
  items: Item[];
  selectedItems: string[];
  onSelect: (ids: string[]) => void;
  canAddNew?: boolean;
  onAttemptAddNew?: () => void;
}

export function BlogCategoryTagSelect({
  type,
  items = [],
  selectedItems = [],
  onSelect,
  canAddNew = false,
  onAttemptAddNew,
}: BlogCategoryTagSelectProps) {
  // For category (single select)
  const handleCategorySelect = (value: string) => {
    if (value === CREATE_NEW_VALUE) {
      if (onAttemptAddNew) onAttemptAddNew();
      return;
    }
    if (value === N_A_VALUE) {
      onSelect([]); // N/A means no category selected
    } else {
      onSelect([value]);
    }
  };

  // For tags (multi-select from dropdown, then shown as badges)
  const handleTagSelect = (id: string) => {
    if (id === CREATE_NEW_VALUE) {
      if (onAttemptAddNew) onAttemptAddNew();
      return;
    }
    const newSelected = selectedItems.includes(id)
      ? selectedItems.filter((item) => item !== id)
      : [...selectedItems, id];
    onSelect(newSelected);
  };

  const handleRemoveTag = (id: string) => {
    const newSelected = selectedItems.filter((item) => item !== id);
    onSelect(newSelected);
  };

  const selectedNames = items
    .filter((item) => selectedItems.includes(item.id))
    .map((item) => ({ id: item.id, name: item.name }));

  const categorySelectValue = type === 'category' ? (selectedItems[0] || N_A_VALUE) : undefined;

  return (
    <div className="space-y-2">
      {/* For categories - use single select */}
      {type === 'category' && (
        <Select value={categorySelectValue} onValueChange={handleCategorySelect}>
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
                <SelectItem value={CREATE_NEW_VALUE} className="text-primary italic flex items-center">
                  <PlusCircle className="h-4 w-4 mr-2" /> Create new category...
                </SelectItem>
              )}
            </SelectGroup>
          </SelectContent>
        </Select>
      )}

      {/* For tags - use custom multi-select UI */}
      {type === 'tag' && (
        <>
          <Select onValueChange={handleTagSelect}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select tag..." />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Tags</SelectLabel>
                {/* No N/A for tags in dropdown, empty selection means no tags */}
                {items.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.name}
                  </SelectItem>
                ))}
                {canAddNew && (
                  <SelectItem value={CREATE_NEW_VALUE} className="text-primary italic flex items-center">
                    <PlusCircle className="h-4 w-4 mr-2" /> Create new tag...
                  </SelectItem>
                )}
              </SelectGroup>
            </SelectContent>
          </Select>

          {/* Display selected tags as badges */}
          {selectedNames.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedNames.map((item) => (
                <Badge key={item.id} variant="secondary" className="gap-1">
                  {item.name}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(item.id)}
                    className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
