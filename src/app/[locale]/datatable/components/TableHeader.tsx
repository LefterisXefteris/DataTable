import { AlertCircle, CheckCircle2, Download, Loader2, Lock, LockOpen, MessageCircle, Plus, Save } from 'lucide-react';

import { Button } from '@/components/ui/button';

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
  onSendWhatsApp?: () => void;
  isStaffRota?: boolean;
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
  onSendWhatsApp,
  isStaffRota,
}: TableHeaderProps) => {
  return (
    <div className="sticky top-0 z-10 border-b border-zinc-800/50 bg-zinc-900/95 px-3 py-3 backdrop-blur-sm md:px-6 md:py-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        {hasChanges && (
          <div className="flex items-center gap-2 md:gap-3">
            <span className="rounded-md border border-amber-500/30 bg-amber-500/20 px-2 py-0.5 text-xs font-medium text-amber-400 md:px-2.5 md:py-1">
              Unsaved changes
            </span>
          </div>
        )}
        <div className={`flex flex-wrap items-center gap-2 md:gap-3 ${!hasChanges ? 'md:ml-auto' : ''}`}>
          <Button
            variant={isItemNameLocked ? 'outline' : 'secondary'}
            size="sm"
            onClick={onLockToggle}
            className={isItemNameLocked ? '' : 'border-amber-500/50 bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 hover:text-amber-400'}
          >
            {isItemNameLocked ? <Lock className="mr-2 h-4 w-4" /> : <LockOpen className="mr-2 h-4 w-4" />}
            <span className="hidden sm:inline">{isItemNameLocked ? 'Locked' : 'Unlocked'}</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onAddRow}
            disabled={isPending}
          >
            <Plus className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Add Row</span>
          </Button>

          {isStaffRota && onSendWhatsApp && (
            <Button
              variant="outline"
              size="sm"
              onClick={onSendWhatsApp}
              className="border-green-500/50 bg-green-500/10 text-green-500 hover:bg-green-500/20 hover:text-green-400"
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">WhatsApp</span>
            </Button>
          )}

          {onExport && (
            <Button
              variant="outline"
              size="sm"
              onClick={onExport}
              className="border-emerald-500/50 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 hover:text-emerald-400"
            >
              <Download className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Export</span>
            </Button>
          )}

          <Button
            size="sm"
            onClick={onSave}
            disabled={!hasChanges || isPending}
            className="bg-blue-600 hover:bg-blue-500"
          >
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            <span className="hidden sm:inline">{isPending ? 'Saving...' : 'Save'}</span>
          </Button>
        </div>
      </div>
      {(error || success) && (
        <div className="mt-3">
          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-400">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-sm text-emerald-400">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              Changes saved successfully!
            </div>
          )}
        </div>
      )}
    </div>
  );
};
