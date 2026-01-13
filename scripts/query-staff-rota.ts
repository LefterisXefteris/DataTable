import { drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';
import { staffRota } from '../src/models/Schema';
import 'dotenv/config';

async function queryStaffRota() {
  console.log('Querying StaffRota table...\n');

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  const client = new Client({
    connectionString: databaseUrl,
  });

  await client.connect();
  const db = drizzle(client);

  try {
    const results = await db.select().from(staffRota);

    console.log(`Found ${results.length} staff rota records:\n`);
    console.log('ID | Employee Name       | Position      | Shift Date | Start   | End     | Location      | Status');
    console.log('---|---------------------|---------------|------------|---------|---------|---------------|----------');

    results.forEach((record) => {
      console.log(
        `${String(record.id).padEnd(2)} | ${record.employeeName.padEnd(19)} | ${record.position.padEnd(13)} | ${record.shiftDate} | ${record.startTime} | ${record.endTime} | ${(record.location || '').padEnd(13)} | ${record.status}`,
      );
    });
  } catch (error) {
    console.error('Error querying data:', error);
    throw error;
  } finally {
    await client.end();
  }
}

queryStaffRota()
  .then(() => {
    console.log('\n✓ Query completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n✗ Query failed:', error);
    process.exit(1);
  });
