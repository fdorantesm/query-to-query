import qs from 'qs';
import { ParsedQuery } from '@query-to-query/common';

export function build(query: ParsedQuery): string {
  const obj: Record<string, unknown> = {};
  if (query.filters && Object.keys(query.filters).length) obj.filter = query.filters;
  if (query.options && Object.keys(query.options).length) obj.options = query.options;
  if (query.sort) obj.sort = query.sort;
  if (query.with) obj.with = query.with;
  return qs.stringify(obj, { encode: false });
}
