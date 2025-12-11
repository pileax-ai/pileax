import type { MenuItem } from 'core/types/menu'

/**
 * Reader default menus
 */
export const defaultReaderMenus: MenuItem[] = [
  {
    id: 'group-toc',
    name: 'toc',
    path: '',
    action: 1,
    meta: {icon: 'toc'},
  },
  {
    id: 'group-note',
    name: 'annotation',
    path: '',
    action: 1,
    meta: {icon: 'notes'},
  },
  {
    id: 'group-search',
    name: 'search',
    path: '',
    action: 1,
    meta: {icon: 'search'},
  },
]
