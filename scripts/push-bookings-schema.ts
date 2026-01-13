import { sql } from 'drizzle-orm';
import { db } from '../src/libs/DB';
import 'dotenv/config';

async function pushBookingsSchema() {
  try {
    console.log('📦 Creating Bookings table...');

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "Bookings" (
        "id" serial PRIMARY KEY NOT NULL,
        "customerName" varchar(255) NOT NULL,
        "numberOfPeople" integer NOT NULL,
        "allergies" text,
        "bookingDate" date NOT NULL,
        "bookingTime" time NOT NULL,
        "phoneNumber" varchar(50),
        "email" varchar(255),
        "specialRequests" text,
        "status" varchar(50) NOT NULL
      );
    `);

    console.log('✅ Bookings table created successfully!');
  } catch (error) {
    console.error('❌ Error creating Bookings table:', error);
  }
}

pushBookingsSchema();
