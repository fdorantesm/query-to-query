export type Primitive = string | number | boolean | Date;

export interface FilterOperators<T = Primitive> {
  eq?: T;
  ne?: T;
  gt?: T;
  gte?: T;
  lt?: T;
  lte?: T;
  in?: T[];
  nin?: T[];
  regex?: string;
}

export type FilterValue<T = Primitive> = T | FilterOperators<T>;

export type Filters = Record<string, FilterValue>;

export interface Options {
  select?: string | string[];
  limit?: number | string;
  skip?: number | string;
  page?: number | string;
}

export interface ParsedQuery {
  filters: Filters;
  options: Options;
  sort?: string;
  with?: string | string[];
}
