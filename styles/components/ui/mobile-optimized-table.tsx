"use client";

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  X, 
  ArrowUpDown,
  Download
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface TableAction {
  label: string;
  icon: React.ElementType;
  onClick: (item: any) => void;
  variant?: 'default' | 'destructive';
}

interface TableColumn {
  key: string;
  label: string;
  type?: 'text' | 'badge' | 'date' | 'currency' | 'custom';
  sortable?: boolean;
  mobileHidden?: boolean;
  render?: (value: any, item: any) => React.ReactNode;
}

interface MobileOptimizedTableProps {
  data: any[];
  columns: TableColumn[];
  title?: string;
  description?: string;
  searchKey?: string;
  searchPlaceholder?: string;
  actions?: TableAction[];
  filters?: {
    key: string;
    label: string;
    options: { label: string; value: string }[];
  }[];
  onSearch?: (query: string) => void;
  onFilter?: (key: string, value: string) => void;
  isLoading?: boolean;
  emptyMessage?: string;
  className?: string;
}

export function MobileOptimizedTable({
  data,
  columns,
  title,
  description,
  searchKey: _searchKey,
  searchPlaceholder = "Search...",
  actions = [],
  filters = [],
  onSearch,
  onFilter,
  isLoading = false,
  emptyMessage = "No data available",
  className,
}: MobileOptimizedTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [sortBy, setSortBy] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    onSearch?.(value);
  };

  const handleFilter = (key: string, value: string) => {
    const newFilters = { ...activeFilters };
    if (value === 'all') {
      delete newFilters[key];
    } else {
      newFilters[key] = value;
    }
    setActiveFilters(newFilters);
    onFilter?.(key, value);
  };

  const handleSort = (columnKey: string) => {
    if (sortBy === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(columnKey);
      setSortDirection('asc');
    }
  };

  const renderCellValue = (column: TableColumn, item: any) => {
    const value = item[column.key];
    
    if (column.render) {
      return column.render(value, item);
    }

    switch (column.type) {
      case 'badge':
        return (
          <Badge variant={value?.toLowerCase() === 'active' ? 'default' : 'secondary'}>
            {value}
          </Badge>
        );
      case 'date':
        return value ? new Date(value).toLocaleDateString() : '-';
      case 'currency':
        return value ? `$${Number(value).toFixed(2)}` : '-';
      default:
        return value || '-';
    }
  };

  const visibleColumns = columns.filter(col => !col.mobileHidden);
  const primaryColumn = visibleColumns[0];
  const secondaryColumns = visibleColumns.slice(1, 3);

  return (
    <div className={cn("w-full space-y-4", className)}>
      {/* Header */}
      {(title || description) && (
        <div className="space-y-2">
          {title && (
            <h3 className="text-lg sm:text-xl font-semibold text-slate-900">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-sm text-slate-600">
              {description}
            </p>
          )}
        </div>
      )}

      {/* Mobile-Optimized Toolbar */}
      <div className="space-y-3">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 h-11 text-base"
          />
        </div>

        {/* Filters Row */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {filters.length > 0 && (
            <Button
              variant={showFilters ? "default" : "outline"}
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="whitespace-nowrap"
            >
              <Filter className="mr-2 h-4 w-4" />
              Filters
              {Object.keys(activeFilters).length > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 text-xs">
                  {Object.keys(activeFilters).length}
                </Badge>
              )}
            </Button>
          )}

          {/* Active Filters */}
          {Object.entries(activeFilters).map(([key, value]) => (
            <Badge
              key={key}
              variant="secondary"
              className="whitespace-nowrap pl-3 pr-1"
            >
              {value}
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-1 ml-1 hover:bg-transparent"
                onClick={() => handleFilter(key, 'all')}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>

        {/* Filter Dropdowns */}
        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-4 bg-slate-50 rounded-lg">
            {filters.map((filter) => (
              <div key={filter.key} className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  {filter.label}
                </label>
                <Select
                  value={activeFilters[filter.key] || 'all'}
                  onValueChange={(value) => handleFilter(filter.key, value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All {filter.label}</SelectItem>
                    {filter.options.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Data Display */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4 space-y-3">
                <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                <div className="h-3 bg-slate-200 rounded w-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : data.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Search className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 text-lg font-medium mb-2">No results found</p>
            <p className="text-slate-400 text-sm">{emptyMessage}</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Mobile Card View (Hidden on Large Screens) */}
          <div className="lg:hidden space-y-3">
            {data.map((item, index) => (
              <Card key={index} className="group hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-slate-900 truncate">
                        {renderCellValue(primaryColumn, item)}
                      </h4>
                      {secondaryColumns.map((column) => (
                        <div key={column.key} className="flex items-center mt-1 text-sm text-slate-600">
                          <span className="font-medium mr-2">{column.label}:</span>
                          {renderCellValue(column, item)}
                        </div>
                      ))}
                    </div>
                    
                    {actions.length > 0 && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="absolute top-4 right-4"
                          >
                            <MoreVertical className="h-6 w-6" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent 
                          align="end" 
                          className="w-64"
                        >
                          {actions.map((action, actionIndex) => (
                            <DropdownMenuItem
                              key={actionIndex}
                              onClick={() => action.onClick(item)}
                              className={cn(
                                "flex items-center py-4 px-4",
                                action.variant === 'destructive' && 'text-red-600 focus:text-red-600'
                              )}
                            >
                              <action.icon className="mr-3 h-6 w-6" />
                              <span className="text-base">{action.label}</span>
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                  
                  {/* Additional details in collapsible format */}
                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100">
                    {visibleColumns.slice(3).map((column) => (
                      <div key={column.key} className="text-xs">
                        <span className="text-slate-500 block">{column.label}</span>
                        <span className="text-slate-900 font-medium">
                          {renderCellValue(column, item)}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Desktop Table View (Hidden on Small Screens) */}
          <div className="hidden lg:block">
            <Card>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      {visibleColumns.map((column) => (
                        <th
                          key={column.key}
                          className="text-left p-4 font-semibold text-slate-700"
                        >
                          {column.sortable ? (
                            <Button
                              variant="ghost"
                              className="h-auto p-0 font-semibold text-slate-700 hover:text-slate-900"
                              onClick={() => handleSort(column.key)}
                            >
                              {column.label}
                              <ArrowUpDown className="ml-2 h-4 w-4" />
                            </Button>
                          ) : (
                            column.label
                          )}
                        </th>
                      ))}
                      {actions.length > 0 && (
                        <th className="text-right p-4 font-semibold text-slate-700">
                          Actions
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item, index) => (
                      <tr
                        key={index}
                        className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                      >
                        {visibleColumns.map((column) => (
                          <td key={column.key} className="p-4">
                            {renderCellValue(column, item)}
                          </td>
                        ))}
                        {actions.length > 0 && (
                          <td className="p-4">
                            <div className="flex items-center justify-end gap-3">
                              {actions.slice(0, 2).map((action, actionIndex) => (
                                <Button
                                  key={actionIndex}
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => action.onClick(item)}
                                  className={cn(
                                    action.variant === 'destructive' && 'text-red-600 hover:text-red-700'
                                  )}
                                >
                                  <action.icon className="h-6 w-6" />
                                  <span className="sr-only">{action.label}</span>
                                </Button>
                              ))}
                              {actions.length > 2 && (
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button 
                                      variant="ghost" 
                                      size="icon"
                                    >
                                      <MoreVertical className="h-6 w-6" />
                                      <span className="sr-only">More actions</span>
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent 
                                    align="end" 
                                    className="w-64 p-2"
                                  >
                                    {actions.slice(2).map((action, actionIndex) => (
                                      <DropdownMenuItem
                                        key={actionIndex}
                                        onClick={() => action.onClick(item)}
                                        className={cn(
                                          "flex items-center py-4 px-4",
                                          action.variant === 'destructive' && 'text-red-600 focus:text-red-600'
                                        )}
                                      >
                                        <action.icon className="mr-3 h-6 w-6" />
                                        <span className="text-base">{action.label}</span>
                                      </DropdownMenuItem>
                                    ))}
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              )}
                            </div>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </>
      )}

      {/* Results Summary */}
      {data.length > 0 && (
        <div className="flex items-center justify-between text-sm text-slate-600 pt-4">
          <p>
            Showing {data.length} result{data.length !== 1 ? 's' : ''}
            {Object.keys(activeFilters).length > 0 && ' (filtered)'}
          </p>
          {actions.some(action => action.label.toLowerCase().includes('export')) && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const exportAction = actions.find(action => 
                  action.label.toLowerCase().includes('export')
                );
                exportAction?.onClick(data);
              }}
            >
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          )}
        </div>
      )}
    </div>
  );
} 