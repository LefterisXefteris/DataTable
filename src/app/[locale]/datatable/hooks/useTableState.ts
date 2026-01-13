import type { EditableRow, EditingCell, TableRow } from '../types';
import { useEffect, useState } from 'react';

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
      // eslint-disable-next-line react-hooks/set-state-in-effect, react-hooks-extra/no-direct-set-state-in-use-effect
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
