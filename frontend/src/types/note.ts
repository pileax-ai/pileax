export interface Note {
  id: string;
  parent: string;
  title: string;
  content: string;
  icon?: string;
  cover?: string;
  createTime?: string;
  updateTime?: string;
}
