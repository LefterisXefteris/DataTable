import { relations } from 'drizzle-orm/relations';
import { categories, tableData } from './Schema';

export const tableDataRelations = relations(tableData, ({ one }) => ({
  category: one(categories, {
    fields: [tableData.categoryName],
    references: [categories.categoryName],
  }),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  tableData: many(tableData),
}));
