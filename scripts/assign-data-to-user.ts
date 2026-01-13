import { sql } from 'drizzle-orm';
import { db } from '../src/libs/DB';
import 'dotenv/config';

/**
 * This script reassigns all data from 'default_user' to a specific Clerk userId.
 *
 * Usage:
 * npx dotenv-cli -e .env -- npx tsx scripts/assign-data-to-user.ts YOUR_CLERK_USER_ID
 *
 * Example:
 * npx dotenv-cli -e .env -- npx tsx scripts/assign-data-to-user.ts user_2abc123xyz
 */

async function assignDataToUser() {
  const targetUserId = process.argv[2];

  if (!targetUserId) {
    console.error('❌ Error: Please provide a target userId as an argument');
    console.log('\nUsage:');
    console.log('  npx dotenv-cli -e .env -- npx tsx scripts/assign-data-to-user.ts YOUR_CLERK_USER_ID');
    console.log('\nExample:');
    console.log('  npx dotenv-cli -e .env -- npx tsx scripts/assign-data-to-user.ts user_2abc123xyz');
    process.exit(1);
  }

  try {
    console.log(`🔄 Reassigning all data from 'default_user' to '${targetUserId}'...`);

    // Update TableData
    console.log('\n📊 Updating Inventory (TableData)...');
    await db.execute(sql`
      UPDATE "TableData"
      SET "userId" = ${targetUserId}
      WHERE "userId" = 'default_user'
    `);
    console.log(`✅ Updated TableData rows`);

    // Update StaffRota
    console.log('\n👥 Updating Staff Rota...');
    await db.execute(sql`
      UPDATE "StaffRota"
      SET "userId" = ${targetUserId}
      WHERE "userId" = 'default_user'
    `);
    console.log(`✅ Updated StaffRota rows`);

    // Update Bookings
    console.log('\n📅 Updating Bookings...');
    await db.execute(sql`
      UPDATE "Bookings"
      SET "userId" = ${targetUserId}
      WHERE "userId" = 'default_user'
    `);
    console.log(`✅ Updated Bookings rows`);

    console.log('\n✅ Successfully reassigned all data!');
    console.log(`\n💡 All data from 'default_user' has been assigned to '${targetUserId}'`);
    console.log('   You can now log in with this user account and see all the seed data.');
  } catch (error) {
    console.error('❌ Error reassigning data:', error);
    throw error;
  }
}

assignDataToUser();
