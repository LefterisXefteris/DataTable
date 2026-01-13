'use server';

import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

import { db } from '@/libs/DB';
import { bookings, staffRota, tableData } from '@/models/Schema';

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
      updateData[column] = typeof value === 'number' ? value : Number.parseFloat(value as string) || 0;
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
    const promises = updates.map((update) => {
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

// Staff Rota Actions
export async function getAllStaffRota() {
  try {
    const result = await db.select().from(staffRota);
    return result;
  } catch (error) {
    console.error('Error fetching staff rota:', error);
    return [];
  }
}

export async function createStaffRotaRow(data: {
  employeeName: string;
  position: string;
  shiftDate: string;
  startTime: string;
  endTime: string;
  location?: string | null;
  status: string;
}) {
  try {
    const result = await db
      .insert(staffRota)
      .values({
        employeeName: data.employeeName,
        position: data.position,
        shiftDate: data.shiftDate,
        startTime: data.startTime,
        endTime: data.endTime,
        location: data.location || null,
        status: data.status,
      })
      .returning();

    revalidatePath('/', 'layout');
    return { success: true, data: result[0] };
  } catch (error) {
    console.error('Error creating staff rota row:', error);
    return { success: false, error: 'Failed to create staff rota row' };
  }
}

export async function deleteStaffRotaRow(rowId: number) {
  try {
    await db
      .delete(staffRota)
      .where(eq(staffRota.id, rowId));

    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error) {
    console.error('Error deleting staff rota row:', error);
    return { success: false, error: 'Failed to delete staff rota row' };
  }
}

export async function batchUpdateStaffRotaRows(updates: Array<{
  id: number;
  employeeName?: string;
  position?: string;
  shiftDate?: string;
  startTime?: string;
  endTime?: string;
  location?: string | null;
  status?: string;
}>) {
  try {
    const promises = updates.map((update) => {
      const { id, ...data } = update;
      return db
        .update(staffRota)
        .set(data)
        .where(eq(staffRota.id, id));
    });

    await Promise.all(promises);
    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error) {
    console.error('Error batch updating staff rota rows:', error);
    return { success: false, error: 'Failed to update staff rota rows' };
  }
}

// Bookings Actions
export async function getBookingsByDate(date: string) {
  try {
    const result = await db.select().from(bookings).where(eq(bookings.bookingDate, date));
    return result;
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return [];
  }
}

export async function createBookingRow(data: {
  customerName: string;
  numberOfPeople: number;
  allergies?: string | null;
  bookingDate: string;
  bookingTime: string;
  phoneNumber?: string | null;
  email?: string | null;
  specialRequests?: string | null;
  status: string;
}) {
  try {
    const result = await db
      .insert(bookings)
      .values({
        customerName: data.customerName,
        numberOfPeople: data.numberOfPeople,
        allergies: data.allergies || null,
        bookingDate: data.bookingDate,
        bookingTime: data.bookingTime,
        phoneNumber: data.phoneNumber || null,
        email: data.email || null,
        specialRequests: data.specialRequests || null,
        status: data.status,
      })
      .returning();

    revalidatePath('/', 'layout');
    return { success: true, data: result[0] };
  } catch (error) {
    console.error('Error creating booking row:', error);
    return { success: false, error: 'Failed to create booking row' };
  }
}

export async function deleteBookingRow(rowId: number) {
  try {
    await db
      .delete(bookings)
      .where(eq(bookings.id, rowId));

    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error) {
    console.error('Error deleting booking row:', error);
    return { success: false, error: 'Failed to delete booking row' };
  }
}

export async function batchUpdateBookingRows(updates: Array<{
  id: number;
  customerName?: string;
  numberOfPeople?: number;
  allergies?: string | null;
  bookingDate?: string;
  bookingTime?: string;
  phoneNumber?: string | null;
  email?: string | null;
  specialRequests?: string | null;
  status?: string;
}>) {
  try {
    const promises = updates.map((update) => {
      const { id, ...data } = update;
      return db
        .update(bookings)
        .set(data)
        .where(eq(bookings.id, id));
    });

    await Promise.all(promises);
    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error) {
    console.error('Error batch updating booking rows:', error);
    return { success: false, error: 'Failed to update booking rows' };
  }
}
