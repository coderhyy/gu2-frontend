export interface PaginationResponse<T> {
  data: T;
  page: number;
  size: number;
  total: number;
}
