import type { ColumnDefinition, EditableRow } from '../types';
import { useEffect, useRef } from 'react';

type TableCellProps = {
  row: EditableRow;
  column: ColumnDefinition;
  isEditing: boolean;
  isItemNameLocked: boolean;
  onCellChange: (rowId: number, column: string, value: string | number) => void;
  onStartEditing: (rowId: number, column: string) => void;
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
  const value = row[column.id];
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
    if (column.type === 'number') {
      return (
        <td className="border-r border-b border-zinc-800/30 bg-blue-500/5 px-6 py-2.5">
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="number"
            value={value as number}
            onChange={e =>
              onCellChange(row.id, column.id, Number.parseFloat(e.target.value) || 0)}
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

    if (column.type === 'date') {
      return (
        <td className="border-r border-b border-zinc-800/30 bg-blue-500/5 px-6 py-2.5">
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="date"
            value={value ? String(value).split('T')[0] : ''}
            onChange={e => onCellChange(row.id, column.id, e.target.value || '')}
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

    if (column.type === 'dropdown') {
      return (
        <td className="border-r border-b border-zinc-800/30 bg-blue-500/5 px-6 py-2.5">
          <select
            ref={inputRef as React.RefObject<HTMLSelectElement>}
            value={String(value || '')}
            onChange={e => onCellChange(row.id, column.id, e.target.value)}
            onBlur={onStopEditing}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                onStopEditing();
              }
            }}
            className="w-full cursor-pointer border-0 bg-transparent px-0 py-0 text-[13px] text-white focus:ring-0 focus:outline-none"
          >
            <option value="" className="bg-zinc-900">
              Select
              {column.name.toLowerCase()}
            </option>
            {column.options?.map(option => (
              <option key={option} value={option} className="bg-zinc-900">{option}</option>
            ))}
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
          onChange={e => onCellChange(row.id, column.id, e.target.value)}
          onBlur={onStopEditing}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === 'Escape') {
              onStopEditing();
            }
          }}
          className={`w-full border-0 bg-transparent px-0 py-0 text-[13px] focus:ring-0 focus:outline-none ${
            column.locked
              ? 'font-semibold tracking-wide text-rose-400'
              : 'text-white'
          }`}
          style={
            column.locked
              ? { textShadow: '0 0 10px rgba(251, 113, 133, 0.4)' }
              : undefined
          }
        />
      </td>
    );
  }

  // Display mode
  const isColumnReadOnly = column.locked && (!row.isNew || isItemNameLocked);
  const isLockedColumn = column.locked;

  return (
    <td
      className={`border-r border-b border-zinc-800/30 px-6 py-2.5 text-[13px] text-zinc-200 ${
        isColumnReadOnly
          ? 'cursor-not-allowed bg-zinc-900/50'
          : 'group cursor-cell transition-colors hover:bg-zinc-800/40'
      }`}
      onClick={() => !isColumnReadOnly && onStartEditing(row.id, column.id)}
      onDoubleClick={() => !isColumnReadOnly && onStartEditing(row.id, column.id)}
      title={isColumnReadOnly ? `${column.name} is read-only` : undefined}
    >
      <div className="flex items-center gap-2">
        {isColumnReadOnly && (
          <svg className="h-3 w-3 flex-shrink-0 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        )}
        <span
          className={
            isLockedColumn
              ? `font-semibold tracking-wide ${
                isColumnReadOnly
                  ? 'text-rose-400/60'
                  : 'text-rose-400 transition-all group-hover:text-rose-300 group-hover:drop-shadow-[0_0_8px_rgba(251,113,133,0.5)]'
              }`
              : isColumnReadOnly
                ? 'text-zinc-500'
                : 'transition-colors group-hover:text-white'
          }
          style={
            isLockedColumn && !isColumnReadOnly
              ? { textShadow: '0 0 10px rgba(251, 113, 133, 0.3)' }
              : undefined
          }
        >
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
