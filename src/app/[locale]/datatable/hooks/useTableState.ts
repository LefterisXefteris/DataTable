import { useEffect, useState } from 'react';
import type { EditableRow, EditingCell, TableRow } from '../types';

export const useTableState = (initialData: TableRow[]) => {
  const [rows, setRows] = useState<EditableRow[]>(initialData);
  const [editingCell, setEditingCell] = useState<EditingCell>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isItemNameLocked, setIsItemNameLocked] = useState(true);

  // Sync state with props when initialData changes (after refresh)
  useEffect(() => {
    if (!hasChanges) {
      setRows(initialData);
    }
  }, [initialData, hasChanges]);

  const markAsChanged = () => {
    setHasChanges(true);
    setSuccess(false);
    setError(null);
  };

  return {
    rows,
    setRows,
    editingCell,
    setEditingCell,
    hasChanges,
    setHasChanges,
    error,
    setError,
    success,
    setSuccess,
    isItemNameLocked,
    setIsItemNameLocked,
    markAsChanged,
  };
};
