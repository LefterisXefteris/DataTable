type TableHeaderProps = {
  hasChanges: boolean;
  isItemNameLocked: boolean;
  isPending: boolean;
  error: string | null;
  success: boolean;
  onLockToggle: () => void;
  onAddRow: () => void;
  onSave: () => void;
  onExport?: () => void;
};

export const TableHeader = ({
  hasChanges,
  isItemNameLocked,
  isPending,
  error,
  success,
  onLockToggle,
  onAddRow,
  onSave,
  onExport,
}: TableHeaderProps) => {
  return (
    <div className="sticky top-0 z-10 border-b border-zinc-800/50 bg-zinc-900/95 px-6 py-4 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold text-white">Data Table</h1>
          {hasChanges && (
            <span className="rounded-md border border-amber-500/30 bg-amber-500/20 px-2.5 py-1 text-xs font-medium text-amber-400">
              Unsaved changes
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onLockToggle}
            className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all duration-200 ${
              isItemNameLocked
                ? 'border-zinc-700 bg-zinc-800 text-zinc-300 hover:border-zinc-600 hover:bg-zinc-700'
                : 'border-amber-500/30 bg-amber-500/20 text-amber-400 hover:border-amber-500/50 hover:bg-amber-500/30'
            }`}
            title={isItemNameLocked ? 'Click to unlock item name editing for new rows' : 'Item name editing unlocked - Click to lock'}
          >
            {isItemNameLocked
              ? (
                  <>
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Locked
                  </>
                )
              : (
                  <>
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                    </svg>
                    Unlocked
                  </>
                )}
          </button>
          <button
            onClick={onAddRow}
            disabled={isPending}
            className="flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:border-zinc-600 hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Row
          </button>
          {onExport && (
            <button
              onClick={onExport}
              className="flex items-center gap-2 rounded-lg border border-green-700 bg-green-800 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:border-green-600 hover:bg-green-700"
              title="Export to Excel"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export to Excel
            </button>
          )}
          <button
            onClick={onSave}
            disabled={!hasChanges || isPending}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-blue-500/20 transition-all duration-200 hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending
              ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                )
              : (
                  <>
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Save Changes
                  </>
                )}
          </button>
        </div>
      </div>
      {(error || success) && (
        <div className="mt-3">
          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-400">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              {error}
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2 rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-2.5 text-sm text-green-400">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Changes saved successfully!
            </div>
          )}
        </div>
      )}
    </div>
  );
};
