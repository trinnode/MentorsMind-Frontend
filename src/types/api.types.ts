export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface Paginated<T> {
  items: T[];
  total: number;
}

export type RequestOptions = {
  signal?: AbortSignal;
};
