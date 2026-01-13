import type { Metadata } from 'next';
import { auth } from '@clerk/nextjs/server';

import { and, eq } from 'drizzle-orm';
import { getTranslations } from 'next-intl/server';
import { redirect } from 'next/navigation';
import { db } from '@/libs/DB';
import { bookings, staffRota, tableData } from '@/models/Schema';
import { SpreadSheet } from '../../DataTableUI';

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({
    locale,
    namespace: 'Dashboard',
  });

  return {
    title: t('meta_title'),
  };
}

export default async function Dashboard() {
  // Get the current user from Clerk
  const { userId } = await auth();

  // Redirect to sign-in if not authenticated
  if (!userId) {
    redirect('/sign-in');
  }

  // Filter all data by the current user's ID
  const inventoryData = await db.select().from(tableData).where(eq(tableData.userId, userId));
  const staffRotaData = await db.select().from(staffRota).where(eq(staffRota.userId, userId));

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0] as string;
  const bookingsData = await db
    .select()
    .from(bookings)
    .where(and(eq(bookings.bookingDate, today), eq(bookings.userId, userId)));

  return (
    <SpreadSheet
      inventoryData={inventoryData}
      staffRotaData={staffRotaData}
      bookingsData={bookingsData}
      initialBookingDate={today}
    />
  );
}
