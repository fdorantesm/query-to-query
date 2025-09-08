import { ParsedQuery, Filters } from '@query-to-query/common';

export function getFilters(query: ParsedQuery): Filters {
  return query.filters;
}
