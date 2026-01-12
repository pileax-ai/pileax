export interface TotalStatistic {
  item: string;
  total: number;
  increment: number;
}
export interface CountStatistic {
  item: string;
  count: number;
}

export interface StatisticResultModel {
  basic: TotalStatistic[];
  group: Indexable<CountStatistic>;
}
