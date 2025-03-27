export interface RequestOptions {
  name: string;
  path?: string;
  query?: any,
  body?: any
}

export interface PageResult {
  pageIndex: number;
  pageSize: number;
  data: any
}
