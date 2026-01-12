export interface QueryResultModel {
  pageIndex: number;
  pageSize: number;
  size: number;
  total: number;
  list: Indexable[];
}
