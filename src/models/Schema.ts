// src/models/Schema.ts
import { bigint, date, doublePrecision, foreignKey, pgTable, serial, text, time, varchar } from 'drizzle-orm/pg-core';

export const categories = pgTable('Categories', {
  categoryName: varchar('CategoryName', { length: 255 }).primaryKey().notNull(),
});

export const tableData = pgTable('TableData', {
  id: serial().primaryKey().notNull(),
  itemName: varchar({ length: 255 }).notNull(),
  quantity: doublePrecision().notNull(),
  unit: varchar({ length: 50 }).notNull(),
  status: varchar({ length: 50 }).notNull(),
  date: date(),
  categoryName: varchar({ length: 255 }),
}, table => [
  foreignKey({
    columns: [table.categoryName],
    foreignColumns: [categories.categoryName],
    name: 'TableData_categoryName_fkey',
  }),
]);

export const staffRota = pgTable('StaffRota', {
  id: serial().primaryKey().notNull(),
  employeeName: varchar({ length: 255 }).notNull(),
  position: varchar({ length: 100 }).notNull(),
  shiftDate: date().notNull(),
  startTime: time().notNull(),
  endTime: time().notNull(),
  location: varchar({ length: 100 }),
  status: varchar({ length: 50 }).notNull(),
});

export const bookings = pgTable('Bookings', {
  id: serial().primaryKey().notNull(),
  customerName: varchar({ length: 255 }).notNull(),
  numberOfPeople: serial().notNull(),
  allergies: text(),
  bookingDate: date().notNull(),
  bookingTime: time().notNull(),
  phoneNumber: varchar({ length: 50 }),
  email: varchar({ length: 255 }),
  specialRequests: text(),
  status: varchar({ length: 50 }).notNull(),
});

export const drizzleMigrations = pgTable('__drizzle_migrations', {
  id: serial().primaryKey().notNull(),
  hash: text().notNull(),
  createdAt: bigint('created_at', { mode: 'number' }),
});
