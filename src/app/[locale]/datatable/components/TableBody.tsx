import type { ColumnDefinition, EditableRow, EditingCell } from '../types';
import { TableCell } from './TableCell';

type TableBodyProps = {
  rows: EditableRow[];
  columns: ColumnDefinition[];
  editingCell: EditingCell;
  isItemNameLocked: boolean;
  isPending: boolean;
  onCellChange: (rowId: number, column: string, value: string | number) => void;
  onStartEditing: (rowId: number, column: string) => void;
  onStopEditing: () => void;
  onDeleteRow: (rowId: number) => void;
};

export const TableBody = ({
  rows,
  columns,
  editingCell,
  isItemNameLocked,
  isPending,
  onCellChange,
  onStartEditing,
  onStopEditing,
  onDeleteRow,
}: TableBodyProps) => {
  const visibleRows = rows.filter(r => !r.isDeleted);

  const renderCell = (row: EditableRow, columnDef: ColumnDefinition) => {
    const isEditing = editingCell?.rowId === row.id && editingCell?.column === columnDef.id;

    return (
      <TableCell
        key={columnDef.id}
        row={row}
        column={columnDef}
        isEditing={isEditing}
        isItemNameLocked={isItemNameLocked}
        onCellChange={onCellChange}
        onStartEditing={onStartEditing}
        onStopEditing={onStopEditing}
      />
    );
  };

  return (
    <tbody className="bg-zinc-950">
      {visibleRows.length === 0
        ? (
            <tr>
              <td colSpan={columns.length + 1} className="px-6 py-16 text-center">
                <div className="flex flex-col items-center gap-3">
                  <svg className="h-10 w-10 text-zinc-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-[13px] text-zinc-500">No data</p>
                  <p className="text-[11px] text-zinc-600">Click "Add Row" to get started</p>
                </div>
              </td>
            </tr>
          )
        : (
            visibleRows.map(row => (
              <tr
                key={row.id}
                className="group transition-colors hover:bg-zinc-900/30"
              >
                {columns.map(column => renderCell(row, column))}
                <td className="border-b border-zinc-800/30 px-6 py-2.5">
                  <button
                    onClick={() => onDeleteRow(row.id)}
                    disabled={isPending}
                    className="group/btn flex items-center gap-1 rounded px-2 py-1 text-[11px] font-medium text-zinc-500 transition-all hover:bg-red-500/10 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
    </tbody>
  );
};
