import { AnyColumn, asc, desc, eq, like, sql } from 'drizzle-orm'

const directions = ['asc', 'desc'] as const;

const isObject = (value: unknown) => {
  return typeof value === 'object' && value !== null;
};

/**
 * Build multiple orders
 * @param schema Table schema
 * @param fields Order fields, e.g. ['title', 'updateTime']
 * @param orderByObject Order object, e.go. { title: 'asc', updateTime: 'desc' }
 */
export const buildOrders = <T extends Record<string, any>, K extends keyof T>(
  schema: T,
  fields: string[],
  orderByObject: Indexable
) => {
  return !isObject(orderByObject) ? [] : Object.entries(orderByObject)
    .filter(([field, direction]) => fields.includes(field) && directions.includes(direction))
    .map(([field, direction]) => {
      const column = schema[field as keyof T] as unknown as AnyColumn;
      return (direction === 'asc')
        ? asc(column)
        : desc(column);
    });
}

/**
 * Build filters
 * @param schema Table schema
 * @param fields Filter fields, e.g. ['title', 'updateTime']
 * @param condition Condition, e.go. { 'title|like': 'abc', type: '1' }
 */
export const buildFilters = <T extends Record<string, any>, K extends keyof T>(
  schema: T,
  fields: string[],
  condition: Indexable
) => {
  return !isObject(condition) ? [] : Object.entries(condition)
    .filter(([field, value]) => fields.includes(field.split('|')[0]))
    .map(([field, value]) => {
      const splits = field.split('|');
      const actualField = splits[0];
      const operation = splits.length > 0 ? splits[1] : 'eq';
      const column = schema[actualField as keyof T] as unknown as AnyColumn;
      switch (operation) {
        case 'like':
          return like(sql`LOWER(${column})`, `%${value.toLowerCase()}%`);
        default:
          return eq(column, value);
      }
    });
}
