'use client';

import { useState, useEffect } from 'react';
import { Check, X, Plus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
}

interface MultiCategorySelectorProps {
  value: string[];
  onChange: (categoryIds: string[]) => void;
  placeholder?: string;
  className?: string;
}

export function MultiCategorySelector({
  value = [],
  onChange,
  placeholder: _placeholder = "Select categories...",
  className,
}: MultiCategorySelectorProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDescription, setNewCategoryDescription] = useState('');

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

  const createCategory = async () => {
    if (!newCategoryName.trim()) {
      toast.error('Category name is required');
      return;
    }

    try {
      setCreating(true);
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          name: newCategoryName.trim(),
          description: newCategoryDescription.trim() || undefined
        }),
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
      
      // Add to selected categories
      onChange([...value, newCategory.id]);
      
      toast.success(`✅ Category "${newCategory.name}" created and added!`);
      
      return newCategory;
    } catch (error) {
      console.error('Failed to create category:', error);
      toast.error(`❌ ${error instanceof Error ? error.message : 'Failed to create category'}`);
    } finally {
      setCreating(false);
    }
    
    // Reset form and close dialog after everything is done (outside try-catch)
    setNewCategoryName('');
    setNewCategoryDescription('');
    setDialogOpen(false);
  };

  const toggleCategory = (categoryId: string) => {
    if (value.includes(categoryId)) {
      onChange(value.filter(id => id !== categoryId));
    } else {
      onChange([...value, categoryId]);
    }
  };

  const removeCategory = (categoryId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    onChange(value.filter(id => id !== categoryId));
  };

  const selectedCategories = categories.filter(cat => value.includes(cat.id));

  return (
    <div className="space-y-4">
      {/* Selected Categories Display */}
      {selectedCategories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedCategories.map((category) => (
            <Badge
              key={`selected-${category.id}`}
              variant="secondary"
              className="flex items-center gap-1 pr-1 bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
            >
              <span className="text-sm">{category.name}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-blue-200"
                onClick={(e) => removeCategory(category.id, e)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}

      {/* Categories Selection Card */}
      <Card className={className}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Select Categories</CardTitle>
            <Dialog open={dialogOpen} onOpenChange={(open) => {
              setDialogOpen(open);
              if (!open) {
                // Reset form when dialog closes
                setNewCategoryName('');
                setNewCategoryDescription('');
              }
            }}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add New Category
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]" key="category-dialog">
                <DialogHeader>
                  <DialogTitle>Create New Category</DialogTitle>
                  <DialogDescription>
                    Add a new category that can be used for competitions.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Category Name *</Label>
                    <Input
                      id="name"
                      placeholder="e.g., Mathematics, Physics, English"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Textarea
                      id="description"
                      placeholder="Brief description of this category..."
                      value={newCategoryDescription}
                      onChange={(e) => setNewCategoryDescription(e.target.value)}
                      className="min-h-[80px]"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setDialogOpen(false);
                      setNewCategoryName('');
                      setNewCategoryDescription('');
                    }}
                    disabled={creating}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={createCategory}
                    disabled={creating || !newCategoryName.trim()}
                    className="gap-2"
                  >
                    {creating ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4" />
                        Create Category
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <span className="ml-2 text-sm text-muted-foreground">Loading categories...</span>
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground mb-3">
                No categories found. Create your first category!
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDialogOpen(true)}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Create First Category
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto">
              {categories.map((category) => {
                const isSelected = value.includes(category.id);
                return (
                  <div
                    key={`category-${category.id}`}
                    className={cn(
                      "flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-all hover:bg-gray-50",
                      isSelected ? "border-blue-500 bg-blue-50" : "border-gray-200"
                    )}
                    onClick={() => toggleCategory(category.id)}
                  >
                    <div 
                      className={cn(
                        "w-4 h-4 rounded border-2 flex items-center justify-center transition-colors",
                        isSelected 
                          ? "bg-blue-600 border-blue-600 text-white" 
                          : "border-gray-300 bg-white"
                      )}
                    >
                      {isSelected && (
                        <Check className="w-3 h-3" />
                      )}
                    </div>
                    <span className={cn(
                      "font-medium text-sm",
                      isSelected ? "text-blue-700" : "text-gray-900"
                    )}>
                      {category.name}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
          
          {selectedCategories.length === 0 && categories.length > 0 && (
            <p className="text-xs text-amber-600 mt-3 text-center">
              ⚠️ Please select at least one category for your competition
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}