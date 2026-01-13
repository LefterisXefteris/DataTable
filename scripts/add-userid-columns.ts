import { sql } from 'drizzle-orm';
import { db } from '../src/libs/DB';
import 'dotenv/config';

async function addUserIdColumns() {
  try {
    console.log('🔧 Adding userId columns to all tables...');

    // Add userId column to TableData
    console.log('Adding userId to TableData...');
    await db.execute(sql`
      ALTER TABLE "TableData"
      ADD COLUMN IF NOT EXISTS "userId" varchar(255) NOT NULL DEFAULT 'default_user';
    `);

    // Add userId column to StaffRota
    console.log('Adding userId to StaffRota...');
    await db.execute(sql`
      ALTER TABLE "StaffRota"
      ADD COLUMN IF NOT EXISTS "userId" varchar(255) NOT NULL DEFAULT 'default_user';
    `);

    // Add userId column to Bookings
    console.log('Adding userId to Bookings...');
    await db.execute(sql`
      ALTER TABLE "Bookings"
      ADD COLUMN IF NOT EXISTS "userId" varchar(255) NOT NULL DEFAULT 'default_user';
    `);

    console.log('✅ Successfully added userId columns to all tables!');
    console.log('⚠️  Note: Existing data has been assigned to "default_user"');
    console.log('💡 You can reassign this data to specific users if needed');
  } catch (error) {
    console.error('❌ Error adding userId columns:', error);
    throw error;
  }
}

addUserIdColumns();
