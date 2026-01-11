import type { EditableRow, TableRow } from '../types';

type TableCellProps = {
  row: EditableRow;
  column: keyof TableRow;
  isEditing: boolean;
  isItemNameLocked: boolean;
  onCellChange: (rowId: number, column: keyof TableRow, value: string | number) => void;
  onStartEditing: (rowId: number, column: keyof TableRow) => void;
  onStopEditing: () => void;
};

export const TableCell = ({
  row,
  column,
  isEditing,
  isItemNameLocked,
  onCellChange,
  onStartEditing,
  onStopEditing,
}: TableCellProps) => {
  const value = row[column];

  if (row.isDeleted) {
    return (
      <td className="border-b border-zinc-800/50 bg-zinc-800/30 px-4 py-3 text-zinc-500 line-through">
        <span className="text-sm">{String(value || '')}</span>
      </td>
    );
  }

  if (isEditing) {
    if (column === 'quantity') {
      return (
        <td className="border-b border-zinc-800/50 bg-zinc-900/50 px-4 py-3">
          <input
            type="number"
            value={value as number}
            onChange={e =>
              onCellChange(row.id, column, Number.parseFloat(e.target.value) || 0)}
            onBlur={onStopEditing}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === 'Escape') {
                onStopEditing();
              }
            }}
            className="w-full rounded-md border border-blue-500/50 bg-zinc-900 px-3 py-1.5 text-sm text-white transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 focus:outline-none"
            autoFocus
          />
        </td>
      );
    }

    if (column === 'date') {
      return (
        <td className="border-b border-zinc-800/50 bg-zinc-900/50 px-4 py-3">
          <input
            type="date"
            value={value ? String(value).split('T')[0] : ''}
            onChange={e => onCellChange(row.id, column, e.target.value || null)}
            onBlur={onStopEditing}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === 'Escape') {
                onStopEditing();
              }
            }}
            className="w-full rounded-md border border-blue-500/50 bg-zinc-900 px-3 py-1.5 text-sm text-white transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 focus:outline-none"
            autoFocus
          />
        </td>
      );
    }

    if (column === 'status') {
      return (
        <td className="border-b border-zinc-800/50 bg-zinc-900/50 px-4 py-3">
          <select
            value={String(value || '')}
            onChange={e => onCellChange(row.id, column, e.target.value)}
            onBlur={onStopEditing}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                onStopEditing();
              }
            }}
            className="w-full cursor-pointer rounded-md border border-blue-500/50 bg-zinc-900 px-3 py-1.5 text-sm text-white transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 focus:outline-none"
            autoFocus
          >
            <option value="" className="bg-zinc-900">Select status</option>
            <option value="Active" className="bg-zinc-900">Active</option>
            <option value="Inactive" className="bg-zinc-900">Inactive</option>
            <option value="Pending" className="bg-zinc-900">Pending</option>
            <option value="Completed" className="bg-zinc-900">Completed</option>
          </select>
        </td>
      );
    }

    // Default text input
    return (
      <td className="border-b border-zinc-800/50 bg-zinc-900/50 px-4 py-3">
        <input
          type="text"
          value={String(value || '')}
          onChange={e => onCellChange(row.id, column, e.target.value)}
          onBlur={onStopEditing}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === 'Escape') {
              onStopEditing();
            }
          }}
          className="w-full rounded-md border border-blue-500/50 bg-zinc-900 px-3 py-1.5 text-sm text-white transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 focus:outline-none"
          autoFocus
        />
      </td>
    );
  }

  // Display mode
  const isItemNameReadOnly = column === 'itemName' && (!row.isNew || isItemNameLocked);

  return (
    <td
      className={`border-b border-zinc-800/50 px-4 py-3 text-sm text-zinc-200 ${
        isItemNameReadOnly
          ? 'cursor-not-allowed bg-zinc-800/10'
          : 'group cursor-pointer transition-colors hover:bg-zinc-800/30'
      }`}
      onClick={() => !isItemNameReadOnly && onStartEditing(row.id, column)}
      onDoubleClick={() => !isItemNameReadOnly && onStartEditing(row.id, column)}
      title={isItemNameReadOnly ? 'Item name is read-only' : undefined}
    >
      <div className="flex items-center gap-2">
        {isItemNameReadOnly && (
          <svg className="h-3.5 w-3.5 flex-shrink-0 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        )}
        <span className={isItemNameReadOnly ? 'text-zinc-400' : 'transition-colors group-hover:text-white'}>
          {value !== null && value !== undefined && String(value) !== ''
            ? String(value)
            : (
                <span className="text-zinc-500 italic">Empty</span>
              )}
        </span>
      </div>
    </td>
  );
};
