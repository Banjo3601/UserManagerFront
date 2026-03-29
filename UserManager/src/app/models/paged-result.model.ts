export interface PagedResult<T> {
  totalCount: number;
  page: number;
  pageSize: number;
  data: T[];
} 