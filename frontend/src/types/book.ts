export interface MenuItemMeta {
  icon?: string,
  iconClass?: string,
  tag?: string,
  separator?: boolean,
  hidden?: boolean,
  collapse?: boolean,
}

export interface BookTocItem {
  id: number;
  label: string;
  href: string;
  subitems?: BookTocItem[]
}

export enum BookOperation {
  Manual = 'manual',
  Load = 'load',
  Preview = 'preview',
  None = 'none',
}
