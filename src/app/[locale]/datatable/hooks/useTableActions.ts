import type { ColumnDefinition, EditableRow, EditingCell } from '../types';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import {
  batchUpdateBookingRows,
  batchUpdateRows,
  batchUpdateStaffRotaRows,
  createBookingRow,
  createRow,
  createStaffRotaRow,
  deleteBookingRow,
  deleteRow,
  deleteStaffRotaRow,
} from '../../DataTable';

type UseTableActionsProps = {
  rows: EditableRow[];
  setRows: React.Dispatch<React.SetStateAction<EditableRow[]>>;
  editingCell: EditingCell;
  setEditingCell: React.Dispatch<React.SetStateAction<EditingCell>>;
  isItemNameLocked: boolean;
  setIsItemNameLocked: React.Dispatch<React.SetStateAction<boolean>>;
  setHasChanges: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  setSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  markAsChanged: () => void;
  sheetType: 'inventory' | 'staffRota' | 'bookings';
  columns: ColumnDefinition[];
};

export const useTableActions = ({
  rows,
  setRows,
  editingCell,
  setEditingCell,
  isItemNameLocked,
  setIsItemNameLocked,
  setHasChanges,
  setError,
  setSuccess,
  markAsChanged,
  sheetType,
  columns,
}: UseTableActionsProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Stop editing a cell
  const stopEditing = () => {
    setEditingCell(null);
  };

  // Handle lock toggle
  const handleLockToggle = () => {
    if (isItemNameLocked === false && editingCell?.column === 'itemName') {
      stopEditing();
    }
    setIsItemNameLocked(!isItemNameLocked);
  };

  // Handle cell value change
  const handleCellChange = (rowId: number, column: string, value: string | number) => {
    setRows(prevRows =>
      prevRows.map((row) => {
        if (row.id === rowId) {
          return { ...row, [column]: value };
        }
        return row;
      }),
    );
    markAsChanged();
  };

  // Start editing a cell
  const startEditing = (rowId: number, column: string) => {
    if (column === 'itemName') {
      const row = rows.find(r => r.id === rowId);
      if (!row?.isNew) {
        return; // Don't allow editing existing itemName
      }
      if (isItemNameLocked) {
        return; // Don't allow editing if locked
      }
    }
    setEditingCell({ rowId, column });
  };

  // Add a new row
  const handleAddRow = () => {
    const newRow: EditableRow = {
      id: Date.now(),
      isNew: true,
    } as EditableRow;

    // Initialize columns with default values based on type
    columns.forEach((col) => {
      if (col.type === 'number') {
        newRow[col.id] = 0;
      } else if (col.type === 'date') {
        newRow[col.id] = null;
      } else {
        newRow[col.id] = '';
      }
    });

    setRows(prev => [...prev, newRow]);
    markAsChanged();
  };

  // Delete a row
  const handleDeleteRow = (rowId: number) => {
    const row = rows.find(r => r.id === rowId);
    if (row?.isNew) {
      setRows(prev => prev.filter(r => r.id !== rowId));
    } else {
      setRows(prev =>
        prev.map(r => (r.id === rowId ? { ...r, isDeleted: true } as EditableRow : r)),
      );
    }
    markAsChanged();
  };

  // Save all changes
  const handleSave = () => {
    setError(null);
    setSuccess(false);

    startTransition(async () => {
      try {
        const newRows = rows.filter(r => r.isNew && !r.isDeleted);
        const updatedRows = rows.filter(
          r => !r.isNew && !r.isDeleted && r.id > 0,
        );
        const deletedRowIds = rows
          .filter(r => r.isDeleted && !r.isNew && r.id > 0)
          .map(r => r.id);

        if (sheetType === 'inventory') {
          // Create new inventory rows
          for (const row of newRows) {
            const result = await createRow({
              itemName: row.itemName as string,
              quantity: row.quantity as number,
              unit: row.unit as string,
              status: row.status as string,
              date: row.date as string | null,
              categoryName: row.categoryName as string | null,
            });

            if (!result.success) {
              throw new Error(result.error || 'Failed to create row');
            }
          }

          // Update existing inventory rows
          if (updatedRows.length > 0) {
            const updates = updatedRows.map(row => ({
              id: row.id,
              itemName: row.itemName as string,
              quantity: row.quantity as number,
              unit: row.unit as string,
              status: row.status as string,
              date: row.date as string | null,
              categoryName: row.categoryName as string | null,
            }));

            const result = await batchUpdateRows(updates);
            if (!result.success) {
              throw new Error(result.error || 'Failed to update rows');
            }
          }

          // Delete inventory rows
          for (const rowId of deletedRowIds) {
            const result = await deleteRow(rowId);
            if (!result.success) {
              throw new Error(result.error || 'Failed to delete row');
            }
          }
        } else if (sheetType === 'staffRota') {
          // Create new staff rota rows
          for (const row of newRows) {
            const result = await createStaffRotaRow({
              employeeName: row.employeeName as string,
              position: row.position as string,
              shiftDate: row.shiftDate as string,
              startTime: row.startTime as string,
              endTime: row.endTime as string,
              location: row.location as string | null,
              status: row.status as string,
            });

            if (!result.success) {
              throw new Error(result.error || 'Failed to create staff rota row');
            }
          }

          // Update existing staff rota rows
          if (updatedRows.length > 0) {
            const updates = updatedRows.map(row => ({
              id: row.id,
              employeeName: row.employeeName as string,
              position: row.position as string,
              shiftDate: row.shiftDate as string,
              startTime: row.startTime as string,
              endTime: row.endTime as string,
              location: row.location as string | null,
              status: row.status as string,
            }));

            const result = await batchUpdateStaffRotaRows(updates);
            if (!result.success) {
              throw new Error(result.error || 'Failed to update staff rota rows');
            }
          }

          // Delete staff rota rows
          for (const rowId of deletedRowIds) {
            const result = await deleteStaffRotaRow(rowId);
            if (!result.success) {
              throw new Error(result.error || 'Failed to delete staff rota row');
            }
          }
        } else if (sheetType === 'bookings') {
          // Create new booking rows
          for (const row of newRows) {
            const result = await createBookingRow({
              customerName: row.customerName as string,
              numberOfPeople: row.numberOfPeople as number,
              allergies: row.allergies as string | null,
              bookingDate: row.bookingDate as string,
              bookingTime: row.bookingTime as string,
              phoneNumber: row.phoneNumber as string | null,
              email: row.email as string | null,
              specialRequests: row.specialRequests as string | null,
              status: row.status as string,
            });

            if (!result.success) {
              throw new Error(result.error || 'Failed to create booking row');
            }
          }

          // Update existing booking rows
          if (updatedRows.length > 0) {
            const updates = updatedRows.map(row => ({
              id: row.id,
              customerName: row.customerName as string,
              numberOfPeople: row.numberOfPeople as number,
              allergies: row.allergies as string | null,
              bookingDate: row.bookingDate as string,
              bookingTime: row.bookingTime as string,
              phoneNumber: row.phoneNumber as string | null,
              email: row.email as string | null,
              specialRequests: row.specialRequests as string | null,
              status: row.status as string,
            }));

            const result = await batchUpdateBookingRows(updates);
            if (!result.success) {
              throw new Error(result.error || 'Failed to update booking rows');
            }
          }

          // Delete booking rows
          for (const rowId of deletedRowIds) {
            const result = await deleteBookingRow(rowId);
            if (!result.success) {
              throw new Error(result.error || 'Failed to delete booking row');
            }
          }
        }

        // Reset state before refresh to ensure proper data sync
        setHasChanges(false);
        setSuccess(true);

        // Use setTimeout to ensure state updates are processed before refresh
        setTimeout(() => {
          router.refresh();
        }, 100);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      }
    });
  };

  return {
    isPending,
    startEditing,
    stopEditing,
    handleCellChange,
    handleAddRow,
    handleDeleteRow,
    handleSave,
    handleLockToggle,
  };
};
