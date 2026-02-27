export interface Note {
  id: string;
  parent: string;
  title: string;
  content: Indexable;
  icon?: string;
  cover?: string;
  favorite?: number;
  styles?: Indexable;
  createTime?: string;
  updateTime?: string;
}
