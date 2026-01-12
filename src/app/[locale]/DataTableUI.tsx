'use client';

import type { DataTableProps, TableRow } from './datatable/types';
import { useState } from 'react';
import * as XLSX from 'xlsx';
import { TableBody, TableColumnHeaders, TableHeader } from './datatable/components';
import { useTableActions, useTableState } from './datatable/hooks';

export { type TableRow } from './datatable/types';

type Sheet = {
  id: number;
  name: string;
  data: TableRow[];
};

export const SpreadSheet = ({ initialData }: DataTableProps) => {
  const [sheets, setSheets] = useState<Sheet[]>([
    { id: 1, name: 'Sheet 1', data: initialData },
  ]);
  const [activeSheetId, setActiveSheetId] = useState(1);

  const activeSheet = sheets.find(s => s.id === activeSheetId)!;
  const state = useTableState(activeSheet.data);
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

  const handleAddSheet = () => {
    // eslint-disable-next-line no-alert
    const pin = prompt('Enter 4-digit PIN to create a new sheet:');

    if (pin === null) {
      // User cancelled the prompt
      return;
    }

    if (pin !== '1996') {
      // eslint-disable-next-line no-alert
      alert('Incorrect PIN. Cannot create new sheet.');
      return;
    }

    const newId = sheets.length > 0 ? Math.max(...sheets.map(s => s.id)) + 1 : 1;
    const newSheet = { id: newId, name: `Sheet ${newId}`, data: [] };
    setSheets(prevSheets => [...prevSheets, newSheet]);
    setActiveSheetId(newId);
  };

  const handleDeleteSheet = (sheetId: number) => {
    if (sheets.length === 1) {
      // eslint-disable-next-line no-alert
      alert('Cannot delete the last sheet.');
      return;
    }

    // eslint-disable-next-line no-alert
    const pin = prompt('Enter 4-digit PIN to delete this sheet:');

    if (pin !== '1996') {
      // eslint-disable-next-line no-alert
      alert('Incorrect PIN. Cannot delete sheet.');
      return;
    }

    const newSheets = sheets.filter(s => s.id !== sheetId);
    setSheets(newSheets);

    if (activeSheetId === sheetId && newSheets[0]) {
      setActiveSheetId(newSheets[0].id);
    }
  };

  const handleExportToExcel = () => {
    // Create a new workbook
    const wb = XLSX.utils.book_new();

    // Convert the current sheet's data to worksheet
    const wsData = [
      // Header row
      ['Item Name', 'Quantity', 'Unit', 'Status', 'Date', 'Category'],
      // Data rows
      ...state.rows.filter(row => !row.isDeleted).map(row => [
        row.itemName,
        row.quantity,
        row.unit,
        row.status,
        row.date,
        row.categoryName,
      ]),
    ];

    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, activeSheet.name);

    // Generate file name with timestamp
    const timestamp = new Date().toISOString().split('T')[0];
    const fileName = `${activeSheet.name}_${timestamp}.xlsx`;

    // Write the file
    XLSX.writeFile(wb, fileName);
  };

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
        onExport={handleExportToExcel}
      />

      <div className="flex h-[calc(100vh-88px)] flex-col">
        {/* Sheet Tabs Container */}
        <div className="border-t border-zinc-800/50 bg-zinc-900/95 backdrop-blur-sm">
          <div className="flex items-center gap-0.5 px-6 py-1">
            {sheets.map(sheet => (
              <div
                key={sheet.id}
                className={`group flex items-center gap-1 border-b-2 transition-all ${
                  activeSheetId === sheet.id
                    ? 'border-blue-500'
                    : 'border-transparent hover:border-zinc-600'
                }`}
              >
                <button
                  onClick={() => setActiveSheetId(sheet.id)}
                  className={`px-4 py-2.5 text-xs font-medium transition-colors ${
                    activeSheetId === sheet.id
                      ? 'text-white'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {sheet.name}
                </button>
                {sheets.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteSheet(sheet.id);
                    }}
                    className="mr-2 rounded-sm p-0.5 text-zinc-500 opacity-0 transition-all group-hover:opacity-100 hover:bg-zinc-800 hover:text-red-400"
                    title="Delete sheet"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={handleAddSheet}
              className="ml-2 flex items-center gap-1.5 rounded-md px-3 py-2 text-xs font-medium text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
              title="Add new sheet"
            >
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Sheet
            </button>
          </div>
        </div>

        {/* Spreadsheet Grid */}
        <div className="flex-1 overflow-auto bg-zinc-950">
          <div className="h-full">
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
