'use client';

import type { DataTableProps } from './datatable/types';
import { TableBody, TableColumnHeaders, TableHeader } from './datatable/components';
import { useTableActions, useTableState } from './datatable/hooks';

export { type TableRow } from './datatable/types';

export const SpreadSheet = ({ initialData }: DataTableProps) => {
  const state = useTableState(initialData);
  const actions = useTableActions({
    rows: state.rows,
    setRows: state.setRows,
    editingCell: state.editingCell,
    setEditingCell: state.setEditingCell,
    isItemNameLocked: state.isItemNameLocked,
    setIsItemNameLocked: state.setIsItemNameLocked,
    setHasChanges: state.setHasChanges,
    setError: state.setError,
    setSuccess: state.setSuccess,
    markAsChanged: state.markAsChanged,
  });

  return (
    <div className="min-h-screen w-full bg-zinc-950 text-white">
      <TableHeader
        hasChanges={state.hasChanges}
        isItemNameLocked={state.isItemNameLocked}
        isPending={actions.isPending}
        error={state.error}
        success={state.success}
        onLockToggle={actions.handleLockToggle}
        onAddRow={actions.handleAddRow}
        onSave={actions.handleSave}
      />

      <div className="px-6 py-6">
        <div className="overflow-hidden rounded-xl border border-zinc-800/50 bg-zinc-900/50 shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <TableColumnHeaders />
              <TableBody
                rows={state.rows}
                editingCell={state.editingCell}
                isItemNameLocked={state.isItemNameLocked}
                isPending={actions.isPending}
                onCellChange={actions.handleCellChange}
                onStartEditing={actions.startEditing}
                onStopEditing={actions.stopEditing}
                onDeleteRow={actions.handleDeleteRow}
              />
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
