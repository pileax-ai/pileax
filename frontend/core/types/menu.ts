export interface MenuItemMeta {
  type?: string,
  icon?: string,
  iconClass?: string,
  svg?: string,
  tag?: string,
  separator?: boolean,
  hidden?: boolean,
  collapse?: boolean,
}
export interface MenuItem {
  id: string;
  parentId?: string;
  parentKey?: string;
  name: string;
  path: string;
  action?: number;
  link?: string;
  icon?: string,
  color?: string,
  meta?: MenuItemMeta,
  children?: MenuItem[]
  type?: number,
  isShow?: number,
  favorite?: number,
  pinned?: boolean,
}
