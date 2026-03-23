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
  RowSelectionState,
} from '@tanstack/react-table';
import {
  ChevronDown,
  Download,
  MoreHorizontal,
  Settings2,
  Trash2,
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
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  // Search configuration
  searchKey?: string;
  searchPlaceholder?: string;
  // Bulk operations
  enableBulkDelete?: boolean;
  onBulkDelete?: (selectedRows: TData[]) => Promise<void>;
  // Export functionality
  enableExport?: boolean;
  onExport?: (data: TData[]) => void;
  exportFileName?: string;
  // Custom toolbar actions
  toolbarActions?: React.ReactNode;
  // Loading states
  isLoading?: boolean;
  // Empty state
  emptyState?: React.ReactNode;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  searchPlaceholder = 'Search...',
  enableBulkDelete = false,
  onBulkDelete,
  enableExport = false,
  onExport,
  exportFileName: _exportFileName = 'data',
  toolbarActions,
  isLoading = false,
  emptyState,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

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
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const selectedRows = table.getFilteredSelectedRowModel().rows.map(row => row.original);
  const hasSelection = selectedRows.length > 0;

  const handleBulkDelete = async () => {
    if (!onBulkDelete || selectedRows.length === 0) return;
    
    setIsDeleting(true);
    try {
      await onBulkDelete(selectedRows);
      setRowSelection({});
      setShowDeleteDialog(false);
    } catch (error) {
      console.error('Bulk delete failed:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleExport = () => {
    if (!onExport) return;
    
    const dataToExport = table.getFilteredRowModel().rows.map(row => row.original);
    onExport(dataToExport);
  };

  return (
    <div className="w-full space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
        <div className="flex flex-1 items-center space-x-3">
          {/* Search Input */}
          {searchKey && (
            <div className="relative">
              <Input
                placeholder={searchPlaceholder}
                value={String(table.getColumn(searchKey)?.getFilterValue() ?? '')}
                onChange={(event) =>
                  table.getColumn(searchKey)?.setFilterValue(event.target.value)
                }
                className="h-10 w-[200px] lg:w-[300px] pl-4 border-gray-300 focus:border-brand-blue-500 focus:ring-2 focus:ring-brand-blue-200 rounded-lg"
              />
            </div>
          )}
          
          {/* Bulk Delete Button */}
          {enableBulkDelete && hasSelection && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDeleteDialog(true)}
              className="h-10 text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400 transition-all duration-200"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete ({selectedRows.length})
            </Button>
          )}
          
          {/* Custom Toolbar Actions */}
          {toolbarActions}
        </div>

        <div className="flex items-center space-x-3">
          {/* Export Button */}
          {enableExport && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              className="h-10 border-gray-300 hover:bg-gray-50 transition-all duration-200"
            >
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          )}
          
          {/* Column Visibility */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-10 border-gray-300 hover:bg-gray-50 transition-all duration-200">
                <Settings2 className="mr-2 h-4 w-4" />
                View
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[150px]">
              <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  const header = column.columnDef.header;
                  const displayName = typeof header === 'string' ? header : column.id;

                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                      {displayName}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Selection Info */}
      {hasSelection && (
        <div className="flex items-center justify-between px-4 py-3 bg-brand-blue-50 border border-brand-blue-200 rounded-lg">
          <div className="text-sm text-brand-blue-700 font-medium">
            {selectedRows.length} of {table.getFilteredRowModel().rows.length} row(s) selected
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setRowSelection({})}
            className="h-8 text-brand-blue-600 hover:bg-brand-blue-100 transition-all duration-200"
          >
            Clear selection
          </Button>
        </div>
      )}

      {/* Table */}
      <div className="rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-32 text-center">
                  <div className="flex items-center justify-center space-x-3">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-blue-500 border-t-transparent" />
                    <span className="text-gray-600 font-medium">Loading...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className="hover:bg-muted/50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  {emptyState || (
                    <div className="text-muted-foreground">No results found.</div>
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="text-sm text-gray-600 font-medium">
          {table.getFilteredRowModel().rows.length} total row(s)
        </div>
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-3">
            <p className="text-sm font-medium text-gray-700">Rows per page</p>
            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => {
                table.setPageSize(Number(e.target.value));
              }}
              className="h-10 w-[80px] rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-brand-blue-500 focus:ring-2 focus:ring-brand-blue-200"
            >
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              className="h-10 w-10 p-0 border-gray-300 hover:bg-gray-50 transition-all duration-200"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              ←
            </Button>
            <div className="text-sm font-medium text-gray-700 min-w-[120px] text-center">
              Page {table.getState().pagination.pageIndex + 1} of{' '}
              {table.getPageCount()}
            </div>
            <Button
              variant="outline"
              className="h-10 w-10 p-0 border-gray-300 hover:bg-gray-50 transition-all duration-200"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              →
            </Button>
          </div>
        </div>
      </div>

      {/* Bulk Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {selectedRows.length} item(s). This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// Helper components for common column types
export const SelectColumn = {
  id: 'select',
  header: ({ table }: any) => (
    <input
      type="checkbox"
      checked={table.getIsAllPageRowsSelected()}
      onChange={(e) => table.toggleAllPageRowsSelected(!!e.target.checked)}
      aria-label="Select all"
      className="h-4 w-4 rounded border-2 border-muted-foreground/50 text-primary focus:ring-1 focus:ring-primary/50 focus:ring-offset-0"
    />
  ),
  cell: ({ row }: any) => (
    <input
      type="checkbox"
      checked={row.getIsSelected()}
      onChange={(e) => row.toggleSelected(!!e.target.checked)}
      aria-label="Select row"
      className="h-4 w-4 rounded border-2 border-muted-foreground/50 text-primary focus:ring-1 focus:ring-primary/50 focus:ring-offset-0"
    />
  ),
  enableSorting: false,
  enableHiding: false,
};

export const ActionsColumn = (actions: (row: any) => React.ReactNode) => ({
  id: 'actions',
  enableHiding: false,
  cell: ({ row }: any) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-gray-100">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {actions(row)}
      </DropdownMenuContent>
    </DropdownMenu>
  ),
});