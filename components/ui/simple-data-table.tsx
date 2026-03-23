'use client';

import React from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  ChevronLeft,
  ChevronRight,
  Search,
  SortAsc,
  SortDesc,
} from 'lucide-react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface SimpleDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  // Search configuration
  searchKey?: string;
  searchPlaceholder?: string;
  // Custom toolbar actions
  toolbarActions?: React.ReactNode;
  // Loading states
  isLoading?: boolean;
  // Empty state
  emptyState?: React.ReactNode;
  // Pagination
  pageSize?: number;
  // Title
  title?: string;
  description?: string;
}

export function SimpleDataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  searchPlaceholder = 'Search...',
  toolbarActions,
  isLoading = false,
  emptyState,
  pageSize = 10,
  title,
  description,
}: SimpleDataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    initialState: {
      pagination: {
        pageSize,
      },
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  return (
    <div className="w-full space-y-6">
      {/* Header Section */}
      {(title || description) && (
        <div className="space-y-2">
          {title && (
            <h2 className="text-2xl font-semibold text-foreground tracking-tight">
              {title}
            </h2>
          )}
          {description && (
            <p className="text-muted-foreground">
              {description}
            </p>
          )}
        </div>
      )}

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4 bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
        <div className="flex flex-1 items-center space-x-3">
          {/* Search Input */}
          {searchKey && (
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder={searchPlaceholder}
                value={String(table.getColumn(searchKey)?.getFilterValue() ?? '')}
                onChange={(event) =>
                  table.getColumn(searchKey)?.setFilterValue(event.target.value)
                }
                className="pl-10 h-10 bg-white border-gray-300 focus:border-brand-blue-500 focus:ring-2 focus:ring-brand-blue-200 rounded-lg"
              />
            </div>
          )}
          
          {/* Custom Toolbar Actions */}
          {toolbarActions}
        </div>

        {/* Results Count */}
        <div className="text-sm text-gray-600 font-medium">
          {table.getFilteredRowModel().rows.length} result(s)
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin">
          <Table className="min-w-full">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="hover:bg-transparent">
                  {headerGroup.headers.map((header) => {
                    const canSort = header.column.getCanSort();
                    const sortDirection = header.column.getIsSorted();
                    
                    return (
                      <TableHead key={header.id} className="bg-gray-50/80">
                        {header.isPlaceholder ? null : (
                          <div className="flex items-center space-x-2">
                            <span>
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                            </span>
                            {canSort && (
                              <button
                                onClick={() => header.column.toggleSorting()}
                                className="p-1 rounded hover:bg-gray-200 transition-colors"
                              >
                                {sortDirection === 'asc' ? (
                                  <SortAsc className="h-3 w-3 text-brand-blue-600" />
                                ) : sortDirection === 'desc' ? (
                                  <SortDesc className="h-3 w-3 text-brand-blue-600" />
                                ) : (
                                  <div className="h-3 w-3 opacity-0 group-hover:opacity-50">
                                    <SortAsc className="h-3 w-3" />
                                  </div>
                                )}
                              </button>
                            )}
                          </div>
                        )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={columns.length} className="h-32 text-center">
                    <div className="flex items-center justify-center space-x-3">
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-blue-500 border-t-transparent" />
                      <span className="text-gray-600 font-medium">Loading...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row, index) => (
                  <TableRow
                    key={row.id}
                    className={cn(
                      "cursor-pointer transition-all duration-200",
                      index % 2 === 0 ? "bg-white" : "bg-gray-50/40"
                    )}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-4">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={columns.length} className="h-32 text-center">
                    {emptyState || (
                      <div className="space-y-2">
                        <div className="text-gray-400 text-lg">📋</div>
                        <div className="text-gray-600 font-medium">No results found</div>
                        <div className="text-gray-500 text-sm">
                          Try adjusting your search terms
                        </div>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      {table.getPageCount() > 1 && (
        <div className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <div className="text-sm text-gray-600 font-medium">
            Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
            {Math.min(
              (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
              table.getFilteredRowModel().rows.length
            )}{' '}
            of {table.getFilteredRowModel().rows.length} results
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="h-10 border-gray-300 hover:bg-gray-50 transition-all duration-200"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            
            <div className="flex items-center space-x-1">
              {Array.from({ length: table.getPageCount() }, (_, i) => i + 1).map((pageNumber) => {
                const isCurrentPage = pageNumber === table.getState().pagination.pageIndex + 1;
                const shouldShow = 
                  pageNumber === 1 ||
                  pageNumber === table.getPageCount() ||
                  Math.abs(pageNumber - (table.getState().pagination.pageIndex + 1)) <= 1;
                
                if (!shouldShow) {
                  if (pageNumber === 2 || pageNumber === table.getPageCount() - 1) {
                    return <span key={pageNumber} className="px-1 text-gray-400">...</span>;
                  }
                  return null;
                }
                
                return (
                  <Button
                    key={pageNumber}
                    variant={isCurrentPage ? "default" : "ghost"}
                    size="sm"
                    onClick={() => table.setPageIndex(pageNumber - 1)}
                    className={cn(
                      "h-10 w-10 p-0 transition-all duration-200",
                      isCurrentPage 
                        ? "bg-brand-blue-600 hover:bg-brand-blue-700 text-white" 
                        : "hover:bg-gray-100"
                    )}
                  >
                    {pageNumber}
                  </Button>
                );
              })}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="h-10 border-gray-300 hover:bg-gray-50 transition-all duration-200"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

 