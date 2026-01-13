import type { ColumnDefinition } from '../types';

type TableColumnHeadersProps = {
  columns: ColumnDefinition[];
};

export const TableColumnHeaders = ({ columns }: TableColumnHeadersProps) => {
  return (
    <thead className="sticky top-0 z-20 bg-zinc-900/95 backdrop-blur-sm">
      <tr className="border-b border-zinc-800">
        {columns.map(column => (
          <th key={column.id} className="border-r border-zinc-800/30 bg-zinc-900 px-6 py-3 text-left">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-medium tracking-wide text-zinc-400">{column.name}</span>
              {column.locked && (
                <span className="text-[10px] font-normal text-zinc-600" title="Read-only for existing items">
                  (locked)
                </span>
              )}
            </div>
          </th>
        ))}
        <th className="w-32 bg-zinc-900 px-6 py-3 text-left">
          <span className="text-[11px] font-medium tracking-wide text-zinc-400">Actions</span>
        </th>
      </tr>
    </thead>
  );
};
