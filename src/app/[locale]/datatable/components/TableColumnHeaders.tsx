export const TableColumnHeaders = () => {
  return (
    <thead className="sticky top-0 z-20 bg-zinc-800/50">
      <tr>
        <th className="border-b border-zinc-800/50 px-4 py-3.5 text-left text-xs font-semibold tracking-wider text-zinc-400 uppercase">
          <div className="flex items-center gap-2">
            <span>Item Name</span>
            <span className="text-[10px] font-normal text-zinc-500 normal-case" title="Read-only for existing items">
              (read-only)
            </span>
          </div>
        </th>
        <th className="border-b border-zinc-800/50 px-4 py-3.5 text-left text-xs font-semibold tracking-wider text-zinc-400 uppercase">
          Quantity
        </th>
        <th className="border-b border-zinc-800/50 px-4 py-3.5 text-left text-xs font-semibold tracking-wider text-zinc-400 uppercase">
          Unit
        </th>
        <th className="border-b border-zinc-800/50 px-4 py-3.5 text-left text-xs font-semibold tracking-wider text-zinc-400 uppercase">
          Status
        </th>
        <th className="border-b border-zinc-800/50 px-4 py-3.5 text-left text-xs font-semibold tracking-wider text-zinc-400 uppercase">
          Date
        </th>
        <th className="border-b border-zinc-800/50 px-4 py-3.5 text-left text-xs font-semibold tracking-wider text-zinc-400 uppercase">
          Category
        </th>
        <th className="w-24 border-b border-zinc-800/50 px-4 py-3.5 text-left text-xs font-semibold tracking-wider text-zinc-400 uppercase">
          Actions
        </th>
      </tr>
    </thead>
  );
};
