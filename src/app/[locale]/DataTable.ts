'use server';

import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

import { db } from '@/libs/DB';
import { tableData } from '@/models/Schema';

export async function updateQuantity(productId: number, newQty: number) {
  await db
    .update(tableData)
    .set({ quantity: newQty })
    .where(eq(tableData.id, productId));

  revalidatePath('/', 'layout');
}

export async function createRow(data: {
  itemName: string;
  quantity: number;
  unit: string;
  status: string;
  date?: string | null;
  categoryName?: string | null;
}) {
  try {
    const result = await db
      .insert(tableData)
      .values({
        itemName: data.itemName,
        quantity: data.quantity,
        unit: data.unit,
        status: data.status,
        date: data.date || null,
        categoryName: data.categoryName || null,
      })
      .returning();

    revalidatePath('/', 'layout');
    return { success: true, data: result[0] };
  } catch (error) {
    console.error('Error creating row:', error);
    return { success: false, error: 'Failed to create row' };
  }
}

export async function updateCell(
  rowId: number,
  column: 'itemName' | 'quantity' | 'unit' | 'status' | 'date' | 'categoryName',
  value: string | number | null,
) {
  try {
    const updateData: Record<string, unknown> = {};
    
    if (column === 'quantity') {
      updateData[column] = typeof value === 'number' ? value : parseFloat(value as string) || 0;
    } else if (column === 'date') {
      updateData[column] = value || null;
    } else {
      updateData[column] = value || '';
    }

    await db
      .update(tableData)
      .set(updateData)
      .where(eq(tableData.id, rowId));

    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error) {
    console.error('Error updating cell:', error);
    return { success: false, error: 'Failed to update cell' };
  }
}

export async function deleteRow(rowId: number) {
  try {
    await db
      .delete(tableData)
      .where(eq(tableData.id, rowId));

    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error) {
    console.error('Error deleting row:', error);
    return { success: false, error: 'Failed to delete row' };
  }
}

export async function batchUpdateRows(updates: Array<{
  id: number;
  itemName?: string;
  quantity?: number;
  unit?: string;
  status?: string;
  date?: string | null;
  categoryName?: string | null;
}>) {
  try {
    const promises = updates.map(update => {
      const { id, ...data } = update;
      return db
        .update(tableData)
        .set(data)
        .where(eq(tableData.id, id));
    });

    await Promise.all(promises);
    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error) {
    console.error('Error batch updating rows:', error);
    return { success: false, error: 'Failed to update rows' };
  }
}
