import qs from 'qs';
import { ParsedQuery, Filters, Options } from '@query-to-query/common';

export function parse(queryString: string): ParsedQuery {
  const obj = qs.parse(queryString, { allowDots: true }) as Record<string, unknown>;
  const { filter = {}, options = {}, sort, with: include } = obj;
  return {
    filters: filter as Filters,
    options: options as Options,
    sort: sort as string | undefined,
    with: include as string | string[] | undefined
  };
}
