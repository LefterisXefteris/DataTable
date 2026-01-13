import type { Metadata } from 'next';
import { eq } from 'drizzle-orm';

import { getTranslations } from 'next-intl/server';
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
  const inventoryData = await db.select().from(tableData);
  const staffRotaData = await db.select().from(staffRota);

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0] as string;
  const bookingsData = await db.select().from(bookings).where(eq(bookings.bookingDate, today));

  return (
    <SpreadSheet
      inventoryData={inventoryData}
      staffRotaData={staffRotaData}
      bookingsData={bookingsData}
      initialBookingDate={today}
    />
  );
}
