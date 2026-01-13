'use client';

import type { ColumnDefinition, TableRow } from './datatable/types';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import { WhatsAppGroupSelector } from '@/components/WhatsAppGroupSelector';
import { getBookingsByDate } from './DataTable';
import { TableBody, TableColumnHeaders, TableHeader } from './datatable/components';
import { useTableActions, useTableState } from './datatable/hooks';

export { type TableRow } from './datatable/types';

// Default column templates
const INVENTORY_COLUMNS: ColumnDefinition[] = [
  { id: 'itemName', name: 'Item Name', type: 'text', required: true, locked: true },
  { id: 'quantity', name: 'Quantity', type: 'number', required: true },
  { id: 'unit', name: 'Unit', type: 'text' },
  { id: 'status', name: 'Status', type: 'dropdown', options: ['Active', 'Inactive', 'Pending', 'Completed'] },
  { id: 'date', name: 'Date', type: 'date' },
  { id: 'categoryName', name: 'Category', type: 'text' },
];

const STAFF_ROTA_COLUMNS: ColumnDefinition[] = [
  { id: 'employeeName', name: 'Employee Name', type: 'text', required: true, locked: true },
  { id: 'position', name: 'Position', type: 'text', required: true },
  { id: 'shiftDate', name: 'Shift Date', type: 'date', required: true },
  { id: 'startTime', name: 'Start Time', type: 'text', required: true },
  { id: 'endTime', name: 'End Time', type: 'text', required: true },
  { id: 'location', name: 'Location', type: 'text' },
  { id: 'status', name: 'Status', type: 'dropdown', options: ['Scheduled', 'Confirmed', 'Pending', 'Cancelled'] },
];

const BOOKINGS_COLUMNS: ColumnDefinition[] = [
  { id: 'customerName', name: 'Customer Name', type: 'text', required: true, locked: true },
  { id: 'numberOfPeople', name: 'Party Size', type: 'number', required: true },
  { id: 'bookingTime', name: 'Time', type: 'text', required: true },
  { id: 'phoneNumber', name: 'Phone', type: 'text' },
  { id: 'email', name: 'Email', type: 'text' },
  { id: 'allergies', name: 'Allergies', type: 'text' },
  { id: 'specialRequests', name: 'Special Requests', type: 'text' },
  { id: 'status', name: 'Status', type: 'dropdown', options: ['Confirmed', 'Pending', 'Seated', 'Completed', 'Cancelled'] },
];

type Sheet = {
  id: number;
  name: string;
  data: TableRow[];
  columns: ColumnDefinition[];
  sheetType: 'inventory' | 'staffRota' | 'bookings';
  bookingDate?: string;
  isCore?: boolean; // Core sheets cannot be deleted
};

type SpreadSheetProps = {
  inventoryData: TableRow[];
  staffRotaData: TableRow[];
  bookingsData: TableRow[];
  initialBookingDate: string;
};

export const SpreadSheet = ({ inventoryData, staffRotaData, bookingsData, initialBookingDate }: SpreadSheetProps) => {
  const [sheets, setSheets] = useState<Sheet[]>([
    { id: 1, name: 'Inventory', data: inventoryData, columns: INVENTORY_COLUMNS, sheetType: 'inventory', isCore: true },
    { id: 2, name: 'Staff Rota', data: staffRotaData, columns: STAFF_ROTA_COLUMNS, sheetType: 'staffRota', isCore: true },
    { id: 3, name: 'Bookings', data: bookingsData, columns: BOOKINGS_COLUMNS, sheetType: 'bookings', bookingDate: initialBookingDate, isCore: true },
  ]);
  const [activeSheetId, setActiveSheetId] = useState(1);
  const [editingSheetId, setEditingSheetId] = useState<number | null>(null);
  const [editingSheetName, setEditingSheetName] = useState('');
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);
  const renameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingSheetId !== null && renameInputRef.current) {
      renameInputRef.current.focus();
    }
  }, [editingSheetId]);

  const activeSheet = sheets.find(s => s.id === activeSheetId)!;
  const state = useTableState(activeSheet.data);
  const actions = useTableActions({
    rows: state.rows,
    setRows: state.setRows,
    editingCell: state.editingCell,
    setEditingCell: state.setEditingCell,
    isItemNameLocked: state.isItemNameLocked,
    setIsItemNameLocked: state.setIsItemNameLocked,
    setHasChanges: state.setHasChanges,
    setError: state.setError,
    setSuccess: state.setSuccess,
    markAsChanged: state.markAsChanged,
    sheetType: activeSheet.sheetType,
    columns: activeSheet.columns,
  });

  const handleAddSheet = () => {
    const newId = sheets.length > 0 ? Math.max(...sheets.map(s => s.id)) + 1 : 1;
    const newSheet = {
      id: newId,
      name: `Sheet ${newId}`,
      data: [],
      columns: INVENTORY_COLUMNS,
      sheetType: 'inventory' as const,
    };
    setSheets(prevSheets => [...prevSheets, newSheet]);
    setActiveSheetId(newId);
  };

  const handleDeleteSheet = (sheetId: number) => {
    const sheet = sheets.find(s => s.id === sheetId);

    // Prevent deletion of core sheets (Inventory, Staff Rota, Bookings)
    if (sheet?.isCore) {
      // eslint-disable-next-line no-alert
      alert('This is a core sheet and cannot be deleted. It\'s essential for hospitality management.');
      return;
    }

    if (sheets.length === 1) {
      return; // Cannot delete the last sheet
    }

    const newSheets = sheets.filter(s => s.id !== sheetId);
    setSheets(newSheets);

    if (activeSheetId === sheetId && newSheets[0]) {
      setActiveSheetId(newSheets[0].id);
    }
  };

  const handleStartRenameSheet = (sheetId: number, currentName: string) => {
    const sheet = sheets.find(s => s.id === sheetId);

    // Prevent renaming of core sheets
    if (sheet?.isCore) {
      // eslint-disable-next-line no-alert
      alert('Core sheets (Inventory, Staff Rota, Bookings) cannot be renamed as they are essential for hospitality operations.');
      return;
    }

    setEditingSheetId(sheetId);
    setEditingSheetName(currentName);
  };

  const handleRenameSheet = (sheetId: number) => {
    if (editingSheetName.trim()) {
      setSheets(prevSheets =>
        prevSheets.map(sheet =>
          sheet.id === sheetId ? { ...sheet, name: editingSheetName.trim() } : sheet,
        ),
      );
    }
    setEditingSheetId(null);
    setEditingSheetName('');
  };

  const handleCancelRename = () => {
    setEditingSheetId(null);
    setEditingSheetName('');
  };

  const handleSendToWhatsApp = () => {
    if (activeSheet.sheetType !== 'staffRota') {
      return;
    }
    setShowWhatsAppModal(true);
  };

  const handleWhatsAppSend = async (groupName: string) => {
    setShowWhatsAppModal(false);

    try {
      const response = await fetch('/api/staff-rota/send-whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ groupName }),
      });

      const data = await response.json();

      if (data.success) {
        // eslint-disable-next-line no-alert
        alert('Staff rota sent to WhatsApp successfully!');
      } else {
        // eslint-disable-next-line no-alert
        alert(`Failed to send: ${data.error}`);
      }
    } catch (error) {
      // eslint-disable-next-line no-alert
      alert('Error sending to WhatsApp. Please try again.');
      console.error('WhatsApp send error:', error);
    }
  };

  const changeBookingDate = async (daysOffset: number) => {
    const currentDate = new Date(activeSheet.bookingDate || new Date());
    currentDate.setDate(currentDate.getDate() + daysOffset);
    const newDate = currentDate.toISOString().split('T')[0] as string;

    setIsLoadingBookings(true);
    try {
      const newBookings = await getBookingsByDate(newDate);
      setSheets(prevSheets =>
        prevSheets.map(sheet =>
          sheet.id === activeSheetId
            ? { ...sheet, data: newBookings, bookingDate: newDate }
            : sheet,
        ),
      );
    } catch (error) {
      console.error('Error loading bookings:', error);
    } finally {
      setIsLoadingBookings(false);
    }
  };

  const formatDisplayDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const bookingDate = new Date(date);
    bookingDate.setHours(0, 0, 0, 0);

    const diffTime = bookingDate.getTime() - today.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'Today';
    }
    if (diffDays === 1) {
      return 'Tomorrow';
    }
    if (diffDays === -1) {
      return 'Yesterday';
    }

    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleExportToExcel = () => {
    // Create a new workbook
    const wb = XLSX.utils.book_new();

    // Convert the current sheet's data to worksheet
    const wsData = [
      // Header row
      ['Item Name', 'Quantity', 'Unit', 'Status', 'Date', 'Category'],
      // Data rows
      ...state.rows.filter(row => !row.isDeleted).map(row => [
        row.itemName,
        row.quantity,
        row.unit,
        row.status,
        row.date,
        row.categoryName,
      ]),
    ];

    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, activeSheet.name);

    // Generate file name with timestamp
    const timestamp = new Date().toISOString().split('T')[0];
    const fileName = `${activeSheet.name}_${timestamp}.xlsx`;

    // Write the file
    XLSX.writeFile(wb, fileName);
  };

  return (
    <div key={activeSheetId} className="flex h-full w-full flex-col bg-zinc-950 text-white">
      {showWhatsAppModal && (
        <WhatsAppGroupSelector
          onClose={() => setShowWhatsAppModal(false)}
          onSend={handleWhatsAppSend}
        />
      )}

      <TableHeader
        hasChanges={state.hasChanges}
        isItemNameLocked={state.isItemNameLocked}
        isPending={actions.isPending}
        error={state.error}
        success={state.success}
        onLockToggle={actions.handleLockToggle}
        onAddRow={actions.handleAddRow}
        onSave={actions.handleSave}
        onExport={handleExportToExcel}
        onSendWhatsApp={handleSendToWhatsApp}
        isStaffRota={activeSheet.sheetType === 'staffRota'}
      />

      <div className="flex h-[calc(100vh-140px)] flex-col md:h-[calc(100vh-100px)]">
        {/* Sheet Tabs Container */}
        <div className="border-t border-zinc-800/50 bg-zinc-900/95 backdrop-blur-sm">
          <div className="flex items-center gap-0.5 overflow-x-auto px-3 py-1 md:px-6">
            {sheets.map(sheet => (
              <div
                key={sheet.id}
                className={`group flex items-center gap-1 border-b-2 transition-all ${
                  activeSheetId === sheet.id
                    ? 'border-blue-500'
                    : 'border-transparent hover:border-zinc-600'
                }`}
              >
                {editingSheetId === sheet.id
                  ? (
                      <input
                        ref={renameInputRef}
                        type="text"
                        value={editingSheetName}
                        onChange={e => setEditingSheetName(e.target.value)}
                        onBlur={() => handleRenameSheet(sheet.id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleRenameSheet(sheet.id);
                          } else if (e.key === 'Escape') {
                            handleCancelRename();
                          }
                        }}
                        className="border-blue-500 bg-zinc-800 px-3 py-2 text-xs font-medium text-white focus:ring-1 focus:ring-blue-500 focus:outline-none md:px-4 md:py-2.5 md:text-sm"
                      />
                    )
                  : (
                      <button
                        onClick={() => setActiveSheetId(sheet.id)}
                        onDoubleClick={() => handleStartRenameSheet(sheet.id, sheet.name)}
                        className={`flex items-center gap-1 px-3 py-2 text-xs font-medium transition-colors md:px-4 md:py-2.5 md:text-sm ${
                          activeSheetId === sheet.id
                            ? 'text-white'
                            : 'text-zinc-400 hover:text-zinc-200'
                        }`}
                        title={sheet.isCore ? 'Core sheet - Essential for hospitality' : 'Double-click to rename'}
                      >
                        {sheet.name}
                        {sheet.isCore && (
                          <svg className="h-3 w-3 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                    )}
                {sheets.length > 1 && !sheet.isCore && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteSheet(sheet.id);
                    }}
                    className="mr-2 rounded-sm p-0.5 text-zinc-500 opacity-0 transition-all group-hover:opacity-100 hover:bg-zinc-800 hover:text-red-400"
                    title="Delete sheet"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={handleAddSheet}
              className="ml-2 flex items-center gap-1 rounded-md px-2 py-2 text-xs font-medium text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white md:gap-1.5 md:px-3 md:text-sm"
              title="Add custom sheet (Core hospitality sheets are permanent)"
            >
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="hidden sm:inline">Add Sheet</span>
              <span className="sm:hidden">+</span>
            </button>
          </div>
        </div>

        {/* Day Navigation for Bookings Sheet */}
        {activeSheet.sheetType === 'bookings' && activeSheet.bookingDate && (
          <div className="border-t border-zinc-800/50 bg-zinc-900/95 px-4 py-3 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <button
                onClick={() => changeBookingDate(-1)}
                disabled={isLoadingBookings}
                className="flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800/50 px-4 py-2 text-sm font-medium text-zinc-300 transition-all hover:bg-zinc-800 hover:text-white disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Previous Day</span>
              </button>

              <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2">
                <Calendar className="h-4 w-4 text-red-500" />
                <span className="text-sm font-semibold text-white">
                  {formatDisplayDate(activeSheet.bookingDate)}
                </span>
                <span className="ml-2 rounded-full bg-red-500/20 px-2 py-0.5 text-xs font-medium text-red-400">
                  {state.rows.filter(r => !r.isDeleted).length}
                  {' '}
                  bookings
                </span>
              </div>

              <button
                onClick={() => changeBookingDate(1)}
                disabled={isLoadingBookings}
                className="flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800/50 px-4 py-2 text-sm font-medium text-zinc-300 transition-all hover:bg-zinc-800 hover:text-white disabled:opacity-50"
              >
                <span className="hidden sm:inline">Next Day</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Spreadsheet Grid */}
        <div className="flex-1 overflow-auto bg-zinc-950">
          {isLoadingBookings
            ? (
                <div className="flex h-full items-center justify-center">
                  <div className="text-center">
                    <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-red-500 border-t-transparent" />
                    <p className="mt-4 text-sm text-zinc-400">Loading bookings...</p>
                  </div>
                </div>
              )
            : (
                <div className="h-full">
                  <table className="w-full border-collapse">
                    <TableColumnHeaders columns={activeSheet.columns} />
                    <TableBody
                      rows={state.rows}
                      columns={activeSheet.columns}
                      editingCell={state.editingCell}
                      isItemNameLocked={state.isItemNameLocked}
                      isPending={actions.isPending}
                      onCellChange={actions.handleCellChange}
                      onStartEditing={actions.startEditing}
                      onStopEditing={actions.stopEditing}
                      onDeleteRow={actions.handleDeleteRow}
                    />
                  </table>
                </div>
              )}
        </div>
      </div>
    </div>
  );
};
