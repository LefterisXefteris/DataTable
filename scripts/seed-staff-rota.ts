import { db } from '../src/libs/DB';
import { staffRota } from '../src/models/Schema';

async function seedStaffRota() {
  console.log('Seeding StaffRota table with test data...');

  const testData = [
    {
      employeeName: 'John Smith',
      position: 'Manager',
      shiftDate: '2026-01-13',
      startTime: '09:00:00',
      endTime: '17:00:00',
      location: 'Main Office',
      status: 'Scheduled',
      userId: 'default_user',
    },
    {
      employeeName: 'Sarah Johnson',
      position: 'Cashier',
      shiftDate: '2026-01-13',
      startTime: '08:00:00',
      endTime: '16:00:00',
      location: 'Store Front',
      status: 'Scheduled',
      userId: 'default_user',
    },
    {
      employeeName: 'Mike Davis',
      position: 'Stock Clerk',
      shiftDate: '2026-01-13',
      startTime: '06:00:00',
      endTime: '14:00:00',
      location: 'Warehouse',
      status: 'Confirmed',
      userId: 'default_user',
    },
    {
      employeeName: 'Emma Wilson',
      position: 'Supervisor',
      shiftDate: '2026-01-14',
      startTime: '10:00:00',
      endTime: '18:00:00',
      location: 'Main Office',
      status: 'Scheduled',
      userId: 'default_user',
    },
    {
      employeeName: 'James Brown',
      position: 'Cashier',
      shiftDate: '2026-01-14',
      startTime: '12:00:00',
      endTime: '20:00:00',
      location: 'Store Front',
      status: 'Pending',
      userId: 'default_user',
    },
    {
      employeeName: 'Lisa Anderson',
      position: 'Stock Clerk',
      shiftDate: '2026-01-14',
      startTime: '14:00:00',
      endTime: '22:00:00',
      location: 'Warehouse',
      status: 'Confirmed',
      userId: 'default_user',
    },
    {
      employeeName: 'David Martinez',
      position: 'Security',
      shiftDate: '2026-01-15',
      startTime: '00:00:00',
      endTime: '08:00:00',
      location: 'Main Entrance',
      status: 'Confirmed',
      userId: 'default_user',
    },
    {
      employeeName: 'Sarah Johnson',
      position: 'Cashier',
      shiftDate: '2026-01-15',
      startTime: '09:00:00',
      endTime: '17:00:00',
      location: 'Store Front',
      status: 'Scheduled',
      userId: 'default_user',
    },
  ];

  try {
    const result = await db.insert(staffRota).values(testData).returning();
    console.log(`✓ Successfully inserted ${result.length} staff rota records`);
    console.log('Sample records:', result.slice(0, 3));
  } catch (error) {
    console.error('Error seeding data:', error);
    throw error;
  }
}

seedStaffRota()
  .then(() => {
    console.log('✓ Seeding completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('✗ Seeding failed:', error);
    process.exit(1);
  });
