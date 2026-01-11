import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { batchUpdateRows, createRow, deleteRow } from '../../DataTable';
import type { EditableRow, TableRow } from '../types';

type UseTableActionsProps = {
  rows: EditableRow[];
  setRows: React.Dispatch<React.SetStateAction<EditableRow[]>>;
  editingCell: { rowId: number; column: keyof TableRow } | null;
  setEditingCell: React.Dispatch<React.SetStateAction<{ rowId: number; column: keyof TableRow } | null>>;
  isItemNameLocked: boolean;
  setIsItemNameLocked: React.Dispatch<React.SetStateAction<boolean>>;
  setHasChanges: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  setSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  markAsChanged: () => void;
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
  const handleCellChange = (rowId: number, column: keyof TableRow, value: string | number) => {
    setRows((prevRows) =>
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
  const startEditing = (rowId: number, column: keyof TableRow) => {
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
      itemName: '',
      quantity: 0,
      unit: '',
      status: '',
      date: null,
      categoryName: null,
      isNew: true,
    };
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
        prev.map(r => (r.id === rowId ? { ...r, isDeleted: true } : r)),
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

        // Create new rows
        for (const row of newRows) {
          const result = await createRow({
            itemName: row.itemName,
            quantity: row.quantity,
            unit: row.unit,
            status: row.status,
            date: row.date,
            categoryName: row.categoryName,
          });

          if (!result.success) {
            throw new Error(result.error || 'Failed to create row');
          }
        }

        // Update existing rows
        if (updatedRows.length > 0) {
          const updates = updatedRows.map(row => ({
            id: row.id,
            itemName: row.itemName,
            quantity: row.quantity,
            unit: row.unit,
            status: row.status,
            date: row.date,
            categoryName: row.categoryName,
          }));

          const result = await batchUpdateRows(updates);
          if (!result.success) {
            throw new Error(result.error || 'Failed to update rows');
          }
        }

        // Delete rows
        for (const rowId of deletedRowIds) {
          const result = await deleteRow(rowId);
          if (!result.success) {
            throw new Error(result.error || 'Failed to delete row');
          }
        }

        setSuccess(true);
        setHasChanges(false);
        router.refresh();
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
