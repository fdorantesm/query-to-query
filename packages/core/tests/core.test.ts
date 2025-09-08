import { parse, build, getFilters, getOptions } from '@query-to-query/core';

describe('core package', () => {
  it('parses query strings and rebuilds them', () => {
    const queryString = 'filter[email]=fernando@dorant.es&filter[age][gte]=18&options[select]=username,email&sort=-createdAt';
    const parsed = parse(queryString);
    expect(getFilters(parsed)).toEqual({ email: 'fernando@dorant.es', age: { gte: '18' } });
    expect(getOptions(parsed)).toEqual({ select: 'username,email', sort: '-createdAt' });
    const rebuilt = build(parsed);
    expect(parse(rebuilt)).toEqual(parsed);
  });

  it('handles array filters, with clauses and pagination', () => {
    const queryString = 'filter[role][in]=admin,supervisor&with=profile&options[limit]=10&options[page]=2';
    const parsed = parse(queryString);
    expect(getFilters(parsed)).toEqual({ role: { in: 'admin,supervisor' } });
    expect(getOptions(parsed)).toEqual({ limit: '10', page: '2', with: 'profile' });
    const rebuilt = build(parsed);
    expect(parse(rebuilt)).toEqual(parsed);
  });
});
