// Type matching the database schema
export type TableRow = {
  id: number;
  itemName: string;
  quantity: number;
  unit: string;
  status: string;
  date: string | null;
  categoryName: string | null;
};

// Type for rows being edited (includes temporary rows without IDs)
export type EditableRow = TableRow & {
  isNew?: boolean;
  isDeleted?: boolean;
};

export type EditingCell = {
  rowId: number;
  column: keyof TableRow;
} | null;

export type DataTableProps = {
  initialData: TableRow[];
};
