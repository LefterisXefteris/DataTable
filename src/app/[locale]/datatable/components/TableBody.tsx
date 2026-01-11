import type { EditableRow, EditingCell, TableRow } from '../types';
import { TableCell } from './TableCell';

type TableBodyProps = {
  rows: EditableRow[];
  editingCell: EditingCell;
  isItemNameLocked: boolean;
  isPending: boolean;
  onCellChange: (rowId: number, column: keyof TableRow, value: string | number) => void;
  onStartEditing: (rowId: number, column: keyof TableRow) => void;
  onStopEditing: () => void;
  onDeleteRow: (rowId: number) => void;
};

export const TableBody = ({
  rows,
  editingCell,
  isItemNameLocked,
  isPending,
  onCellChange,
  onStartEditing,
  onStopEditing,
  onDeleteRow,
}: TableBodyProps) => {
  const visibleRows = rows.filter(r => !r.isDeleted);

  const renderCell = (row: EditableRow, column: keyof TableRow) => {
    const isEditing = editingCell?.rowId === row.id && editingCell?.column === column;

    return (
      <TableCell
        key={column}
        row={row}
        column={column}
        isEditing={isEditing}
        isItemNameLocked={isItemNameLocked}
        onCellChange={onCellChange}
        onStartEditing={onStartEditing}
        onStopEditing={onStopEditing}
      />
    );
  };

  return (
    <tbody className="divide-y divide-zinc-800/50 bg-zinc-900/30">
      {visibleRows.length === 0
        ? (
            <tr>
              <td colSpan={7} className="px-4 py-12 text-center">
                <div className="flex flex-col items-center gap-3">
                  <svg className="h-12 w-12 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-sm text-zinc-400">No data available</p>
                  <p className="text-xs text-zinc-500">Click &quot;Add Row&quot; to create a new row</p>
                </div>
              </td>
            </tr>
          )
        : (
            visibleRows.map((row) => (
              <tr
                key={row.id}
                className="group transition-colors hover:bg-zinc-800/20"
              >
                {renderCell(row, 'itemName')}
                {renderCell(row, 'quantity')}
                {renderCell(row, 'unit')}
                {renderCell(row, 'status')}
                {renderCell(row, 'date')}
                {renderCell(row, 'categoryName')}
                <td className="border-b border-zinc-800/50 px-4 py-3">
                  <button
                    onClick={() => onDeleteRow(row.id)}
                    disabled={isPending}
                    className="group/btn flex items-center gap-1.5 rounded-md border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-400 transition-all duration-200 hover:border-red-500/50 hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <svg className="h-3.5 w-3.5 transition-transform group-hover/btn:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
