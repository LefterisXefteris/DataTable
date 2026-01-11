// src/models/Schema.ts
import { bigint, date, doublePrecision, foreignKey, pgTable, serial, text, varchar } from 'drizzle-orm/pg-core';

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

export const drizzleMigrations = pgTable('__drizzle_migrations', {
  id: serial().primaryKey().notNull(),
  hash: text().notNull(),
  createdAt: bigint('created_at', { mode: 'number' }),
});
