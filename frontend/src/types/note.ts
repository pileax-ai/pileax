export interface Note {
  id: string;
  parent: string;
  title: string;
  content: string;
  icon?: string;
  cover?: string;
  favorite?: number;
  styles?: string;
  createTime?: string;
  updateTime?: string;
}
