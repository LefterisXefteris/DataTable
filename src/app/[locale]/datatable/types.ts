// Column definition
export type ColumnType = 'text' | 'number' | 'date' | 'dropdown';

export type ColumnDefinition = {
  id: string;
  name: string;
  type: ColumnType;
  required?: boolean;
  locked?: boolean;
  options?: string[]; // For dropdown type
};

// Dynamic row type with required id field
export type TableRow = {
  id: number;
} & Record<string, string | number | null | boolean | undefined>;

// Type for rows being edited (includes temporary rows without IDs)
export type EditableRow = TableRow & {
  isNew?: boolean;
  isDeleted?: boolean;
};

export type EditingCell = {
  rowId: number;
  column: string;
} | null;

export type DataTableProps = {
  initialData: TableRow[];
};
