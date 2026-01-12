export const TableColumnHeaders = () => {
  return (
    <thead className="sticky top-0 z-20 bg-zinc-900/95 backdrop-blur-sm">
      <tr className="border-b border-zinc-800">
        <th className="border-r border-zinc-800/30 bg-zinc-900 px-6 py-3 text-left">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-medium tracking-wide text-zinc-400">Item Name</span>
            <span className="text-[10px] font-normal text-zinc-600" title="Read-only for existing items">
              (locked)
            </span>
          </div>
        </th>
        <th className="border-r border-zinc-800/30 bg-zinc-900 px-6 py-3 text-left">
          <span className="text-[11px] font-medium tracking-wide text-zinc-400">Quantity</span>
        </th>
        <th className="border-r border-zinc-800/30 bg-zinc-900 px-6 py-3 text-left">
          <span className="text-[11px] font-medium tracking-wide text-zinc-400">Unit</span>
        </th>
        <th className="border-r border-zinc-800/30 bg-zinc-900 px-6 py-3 text-left">
          <span className="text-[11px] font-medium tracking-wide text-zinc-400">Status</span>
        </th>
        <th className="border-r border-zinc-800/30 bg-zinc-900 px-6 py-3 text-left">
          <span className="text-[11px] font-medium tracking-wide text-zinc-400">Date</span>
        </th>
        <th className="border-r border-zinc-800/30 bg-zinc-900 px-6 py-3 text-left">
          <span className="text-[11px] font-medium tracking-wide text-zinc-400">Category</span>
        </th>
        <th className="w-32 bg-zinc-900 px-6 py-3 text-left">
          <span className="text-[11px] font-medium tracking-wide text-zinc-400">Actions</span>
        </th>
      </tr>
    </thead>
  );
};
