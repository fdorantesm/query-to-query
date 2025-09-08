import { ParsedQuery } from '@query-to-query/common';
import { MongoBuildResult } from './types';

export function buildMongoQuery(query: ParsedQuery): MongoBuildResult {
  const mongoFilter: Record<string, unknown> = {};
  const { filters, options, sort } = query;

  for (const [field, value] of Object.entries(filters)) {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      const mongoOps: Record<string, unknown> = {};
      for (const [op, val] of Object.entries(value as Record<string, unknown>)) {
        switch (op) {
          case 'gt':
          case 'gte':
          case 'lt':
          case 'lte':
          case 'ne':
            mongoOps[`$${op}`] = val;
            break;
          case 'in':
          case 'nin':
            mongoOps[`$${op}`] = String(val).split(',');
            break;
          case 'like':
          case 'regex':
            mongoOps['$regex'] = val;
            break;
          default:
            mongoOps[`$${op}`] = val;
        }
      }
      mongoFilter[field] = mongoOps;
    } else {
      mongoFilter[field] = value as unknown;
    }
  }

  const mongoOptions: Record<string, unknown> = {};

  if (options.select) {
    const fields = String(options.select).split(',').map(f => f.trim()).filter(f => f.length > 0);
    const hasExclusion = fields.some(f => f.startsWith('-'));
    const hasInclusion = fields.some(f => !f.startsWith('-'));
    if (hasExclusion && hasInclusion) {
      throw new Error("Cannot mix inclusion and exclusion in projection (except for _id).");
    }
    if (hasExclusion) {
      mongoOptions.projection = fields.reduce<Record<string, 0>>((acc, f) => {
        acc[f.substring(1)] = 0;
        return acc;
      }, {});
    } else {
      mongoOptions.projection = fields.reduce<Record<string, 1>>((acc, f) => {
        acc[f] = 1;
        return acc;
      }, {});
    }
  }

  if (sort) {
    const sortFields = String(sort).split(',');
    mongoOptions.sort = sortFields.reduce<Record<string, 1 | -1>>((acc, f) => {
      if (f.startsWith('-')) {
        acc[f.substring(1)] = -1;
      } else {
        acc[f] = 1;
      }
      return acc;
    }, {});
  }

  if (options.page) {
    const page = Number(options.page);
    const limit = Number(options.limit) || 10;
    mongoOptions.skip = (page - 1) * limit;
    mongoOptions.limit = limit;
  } else if (options.limit) {
    mongoOptions.limit = Number(options.limit);
  }
  if (options.skip) mongoOptions.skip = Number(options.skip);

  return { filter: mongoFilter, options: mongoOptions };
}
