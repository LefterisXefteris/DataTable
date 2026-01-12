import type { EditableRow, TableRow } from '../types';
import { useEffect, useRef } from 'react';

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
  const inputRef = useRef<HTMLInputElement | HTMLSelectElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  if (row.isDeleted) {
    return (
      <td className="border-r border-b border-zinc-800/30 bg-zinc-800/20 px-6 py-2.5 text-zinc-500 line-through">
        <span className="text-[13px]">{String(value || '')}</span>
      </td>
    );
  }

  if (isEditing) {
    if (column === 'quantity') {
      return (
        <td className="border-r border-b border-zinc-800/30 bg-blue-500/5 px-6 py-2.5">
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
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
            className="w-full border-0 bg-transparent px-0 py-0 text-[13px] text-white focus:ring-0 focus:outline-none"
          />
        </td>
      );
    }

    if (column === 'date') {
      return (
        <td className="border-r border-b border-zinc-800/30 bg-blue-500/5 px-6 py-2.5">
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="date"
            value={value ? String(value).split('T')[0] : ''}
            onChange={e => onCellChange(row.id, column, e.target.value || '')}
            onBlur={onStopEditing}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === 'Escape') {
                onStopEditing();
              }
            }}
            className="w-full border-0 bg-transparent px-0 py-0 text-[13px] text-white focus:ring-0 focus:outline-none"
          />
        </td>
      );
    }

    if (column === 'status') {
      return (
        <td className="border-r border-b border-zinc-800/30 bg-blue-500/5 px-6 py-2.5">
          <select
            ref={inputRef as React.RefObject<HTMLSelectElement>}
            value={String(value || '')}
            onChange={e => onCellChange(row.id, column, e.target.value)}
            onBlur={onStopEditing}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                onStopEditing();
              }
            }}
            className="w-full cursor-pointer border-0 bg-transparent px-0 py-0 text-[13px] text-white focus:ring-0 focus:outline-none"
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
      <td className="border-r border-b border-zinc-800/30 bg-blue-500/5 px-6 py-2.5">
        <input
          ref={inputRef as React.RefObject<HTMLInputElement>}
          type="text"
          value={String(value || '')}
          onChange={e => onCellChange(row.id, column, e.target.value)}
          onBlur={onStopEditing}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === 'Escape') {
              onStopEditing();
            }
          }}
          className="w-full border-0 bg-transparent px-0 py-0 text-[13px] text-white focus:ring-0 focus:outline-none"
        />
      </td>
    );
  }

  // Display mode
  const isItemNameReadOnly = column === 'itemName' && (!row.isNew || isItemNameLocked);

  return (
    <td
      className={`border-r border-b border-zinc-800/30 px-6 py-2.5 text-[13px] text-zinc-200 ${
        isItemNameReadOnly
          ? 'cursor-not-allowed bg-zinc-900/50'
          : 'group cursor-cell transition-colors hover:bg-zinc-800/40'
      }`}
      onClick={() => !isItemNameReadOnly && onStartEditing(row.id, column)}
      onDoubleClick={() => !isItemNameReadOnly && onStartEditing(row.id, column)}
      title={isItemNameReadOnly ? 'Item name is read-only' : undefined}
    >
      <div className="flex items-center gap-2">
        {isItemNameReadOnly && (
          <svg className="h-3 w-3 flex-shrink-0 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        )}
        <span className={isItemNameReadOnly ? 'text-zinc-500' : 'transition-colors group-hover:text-white'}>
          {value !== null && value !== undefined && String(value) !== ''
            ? String(value)
            : (
                <span className="text-zinc-600 italic">—</span>
              )}
        </span>
      </div>
    </td>
  );
};
