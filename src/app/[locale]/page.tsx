import { db } from '@/libs/DB';
import { tableData } from '../../models/Schema';
import { SpreadSheet } from './DataTableUI';

export default async function Page() {
  const initialData = await db.select().from(tableData);

  return <SpreadSheet initialData={initialData} />;
}
