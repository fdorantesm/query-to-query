import { ParsedQuery, Options } from '@query-to-query/common';

export function getOptions(query: ParsedQuery): Options & { sort?: string; with?: string | string[] } {
  const { options, sort, with: include } = query;
  const opts: Options & { sort?: string; with?: string | string[] } = { ...options };
  if (sort) opts.sort = sort;
  if (include) opts.with = include;
  return opts;
}
