import { db } from '../src/libs/DB';
import { bookings } from '../src/models/Schema';
import 'dotenv/config';

const customerNames = [
  'James Wilson',
  'Emma Thompson',
  'Oliver Martinez',
  'Sophia Anderson',
  'William Brown',
  'Isabella Garcia',
  'Lucas Rodriguez',
  'Mia Davis',
  'Ethan Miller',
  'Charlotte Wilson',
  'Alexander Moore',
  'Amelia Taylor',
  'Benjamin Lee',
  'Harper White',
  'Samuel Harris',
  'Evelyn Clark',
  'Daniel Lewis',
  'Abigail Walker',
  'Matthew Hall',
  'Emily Allen',
];

const allergies = [
  null,
  'Peanuts',
  'Gluten',
  'Dairy',
  'Shellfish',
  'Tree nuts',
  'Eggs',
  'Soy',
  'Fish',
  'Gluten, Dairy',
  'Peanuts, Tree nuts',
  null,
  null,
  'Shellfish, Fish',
];

const specialRequests = [
  null,
  'Window seat preferred',
  'Celebrating anniversary',
  'High chair needed',
  'Quiet table please',
  null,
  'Birthday celebration',
  'Wheelchair accessible',
  null,
  'Vegetarian menu needed',
  'Baby seat required',
  null,
];

const times = ['11:00:00', '11:30:00', '12:00:00', '12:30:00', '13:00:00', '13:30:00', '18:00:00', '18:30:00', '19:00:00', '19:30:00', '20:00:00', '20:30:00', '21:00:00'];

function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)] as T;
}

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0] || '';
}

function generatePhoneNumber(): string {
  return `+44 ${getRandomInt(7000, 7999)} ${getRandomInt(100000, 999999)}`;
}

function generateEmail(name: string): string {
  const cleanName = name.toLowerCase().replace(' ', '.');
  const domains = ['gmail.com', 'outlook.com', 'yahoo.com', 'hotmail.com'];
  return `${cleanName}@${getRandomItem(domains)}`;
}

async function seedBookings() {
  try {
    console.log('📅 Seeding bookings for the next 4 months...');

    const today = new Date();
    const bookingsToInsert = [];

    // Generate bookings for the next 120 days (4 months)
    for (let dayOffset = 0; dayOffset < 120; dayOffset++) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + dayOffset);

      // Generate 3-8 random bookings per day
      const numBookings = getRandomInt(3, 8);

      for (let i = 0; i < numBookings; i++) {
        const customerName = getRandomItem(customerNames);

        bookingsToInsert.push({
          customerName,
          numberOfPeople: getRandomInt(1, 12),
          allergies: getRandomItem(allergies),
          bookingDate: formatDate(currentDate),
          bookingTime: getRandomItem(times),
          phoneNumber: generatePhoneNumber(),
          email: generateEmail(customerName),
          specialRequests: getRandomItem(specialRequests),
          status: dayOffset === 0
            ? getRandomItem(['Confirmed', 'Pending', 'Seated'])
            : dayOffset < 7
              ? getRandomItem(['Confirmed', 'Pending'])
              : 'Confirmed',
        });
      }
    }

    console.log(`📝 Inserting ${bookingsToInsert.length} bookings...`);

    // Insert in batches of 100
    for (let i = 0; i < bookingsToInsert.length; i += 100) {
      const batch = bookingsToInsert.slice(i, i + 100);
      await db.insert(bookings).values(batch);
      console.log(`✅ Inserted batch ${Math.floor(i / 100) + 1} (${batch.length} records)`);
    }

    console.log('✅ Bookings seeded successfully!');
    console.log(`📊 Total bookings created: ${bookingsToInsert.length}`);
  } catch (error) {
    console.error('❌ Error seeding bookings:', error);
  }
}

seedBookings();
