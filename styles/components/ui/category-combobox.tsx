'use client';

import { useState, useEffect } from 'react';
import { Check, ChevronsUpDown, Plus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
}

interface CategoryComboboxProps {
  value?: string;
  onSelect: (categoryId: string | null, category?: Category) => void;
  placeholder?: string;
  className?: string;
}

export function CategoryCombobox({
  value,
  onSelect,
  placeholder = "Select category...",
  className,
}: CategoryComboboxProps) {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  // Load categories on mount
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/categories');
      if (response.ok) {
        const result = await response.json();
        setCategories(result.data || []);
      }
    } catch (error) {
      console.error('Failed to load categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const createCategory = async (name: string) => {
    try {
      setCreating(true);
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: name.trim() }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Network error' }));
        throw new Error(error.error || `Failed to create category (${response.status})`);
      }

      const result = await response.json();
      const newCategory = result.data;

      if (!newCategory) {
        throw new Error('Invalid response from server');
      }

      // Add to local list (sorted by name)
      setCategories(prev => [...prev, newCategory].sort((a, b) => a.name.localeCompare(b.name)));
      
      // Select the new category
      onSelect(newCategory.id, newCategory);
      setOpen(false);
      setSearchValue('');
      
      toast.success(`✅ Category "${name}" created successfully!`);
      
      return newCategory;
    } catch (error) {
      console.error('Failed to create category:', error);
      toast.error(`❌ ${error instanceof Error ? error.message : 'Failed to create category'}`);
      // Don't throw to allow user to try again
    } finally {
      setCreating(false);
    }
  };

  const selectedCategory = categories.find(cat => cat.id === value);

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  const exactMatch = filteredCategories.find(
    cat => cat.name.toLowerCase() === searchValue.toLowerCase()
  );

  const shouldShowCreateOption = searchValue.trim() && !exactMatch && searchValue.length >= 2;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between h-10", className)}
        >
          {selectedCategory ? (
            <div className="flex items-center gap-2 truncate">
              <span className="truncate">{selectedCategory.name}</span>
              <Badge variant="outline" className="text-xs flex-shrink-0">
                {selectedCategory.slug}
              </Badge>
            </div>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="start">
        <Command>
          <CommandInput
            placeholder="Type to search or create new category..."
            value={searchValue}
            onValueChange={setSearchValue}
            className="border-0 focus:ring-0"
          />
          <CommandList className="max-h-[300px]">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span className="ml-2 text-sm text-muted-foreground">Loading categories...</span>
              </div>
            ) : (
              <>
                {/* Show create option first if user is typing */}
                {shouldShowCreateOption && (
                  <CommandGroup heading="✨ Create New Category">
                    <CommandItem
                      onSelect={() => {
                        if (!creating) {
                          createCategory(searchValue.trim());
                        }
                      }}
                      disabled={creating}
                      className="cursor-pointer bg-blue-50 hover:bg-blue-100 border border-blue-200"
                    >
                      {creating ? (
                        <Loader2 className="mr-3 h-4 w-4 animate-spin text-primary" />
                      ) : (
                        <Plus className="mr-3 h-4 w-4 text-primary" />
                      )}
                      <div className="flex flex-col gap-1">
                        <span className="font-medium text-primary">
                          {creating ? 'Creating category...' : `Create "${searchValue}"`}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Press Enter to create this new category
                        </span>
                      </div>
                    </CommandItem>
                  </CommandGroup>
                )}

                {/* Existing categories */}
                {filteredCategories.length > 0 && (
                  <CommandGroup heading="📂 Choose Existing Category">
                    {filteredCategories.map((category) => (
                      <CommandItem
                        key={category.id}
                        value={category.name}
                        onSelect={() => {
                          onSelect(category.id === value ? null : category.id, category);
                          setOpen(false);
                          setSearchValue('');
                        }}
                        className="cursor-pointer"
                      >
                        <Check
                          className={cn(
                            "mr-3 h-4 w-4 text-primary",
                            value === category.id ? "opacity-100" : "opacity-0"
                          )}
                        />
                        <div className="flex flex-col gap-1 flex-1">
                          <span className="font-medium">{category.name}</span>
                          {category.description && (
                            <span className="text-xs text-muted-foreground line-clamp-2">
                              {category.description}
                            </span>
                          )}
                        </div>
                        <Badge variant="outline" className="text-xs ml-2">
                          {category.slug}
                        </Badge>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}

                {/* Empty state */}
                {!loading && filteredCategories.length === 0 && !shouldShowCreateOption && (
                  <CommandEmpty>
                    <div className="flex flex-col items-center gap-2 py-6">
                      <div className="text-sm text-muted-foreground">
                        {categories.length === 0 
                          ? "No categories found. Create your first one!" 
                          : "No matching categories found."
                        }
                      </div>
                      {searchValue.length >= 2 && (
                        <div className="text-xs text-muted-foreground">
                          Type at least 2 characters to create a new category
                        </div>
                      )}
                    </div>
                  </CommandEmpty>
                )}
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
} 