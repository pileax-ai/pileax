import { useI18n } from 'vue-i18n'
import { useNaviStore } from 'stores/navi.setup'

import type { MenuItem } from 'core/types/menu'

/**
 * List to Tree
 * @param list
 * @param id
 */
export const nestMenu = (list :MenuItem[], id = 'root') => {
    return list
      .filter(item => item.parentId === id)
      .map((item) => {
          const node = buildMenuItem(item)
          node.children = nestMenu(list, item.id)
          return node
      })
}

export const flattenMenu = (tree: MenuItem[], parentId = '', list: MenuItem[]) => {
  if (!tree) return list

  for (const item of tree) {
    list.push(buildAppMenuItem(item, parentId))

    if (item.children?.length) {
      flattenMenu(item.children, item.id, list)
    }
  }

  return list
}

export const buildAppMenuItem = (item :MenuItem, parentId = '') :MenuItem => {
  return {
    id: item.id,
    parentId: parentId,
    name: item.name,
    path: item.path,
    action: item.action,
    link: item.link,
    icon: item.icon || item.meta?.icon,
  }
}

export const buildMenuItem = (item :MenuItem) :MenuItem => {
    return {
      id: item.id,
      name: item.name,
      path: item.path,
      action: item.action,
      link: item.link,
      icon: item.icon || item.meta?.icon,
      meta: {
        icon: item.icon || item.meta?.icon,
        hidden: item.isShow !== 1
      }
    }
}

export const findMenuByPath = (path :string) => {
  const naviStore = useNaviStore()
  const menus = naviStore.menus
  const menu = menus.find((e) => e.path === path)

  return (menu || {}) as MenuItem
}

export const menuLabel = (name :string) => {
  if (!name
    || name.slice(0, 1).match(/^.*[A-Z]+.*$/)
    || name.slice(0, 1).match(/^[\u4e00-\u9fa5]+$/)) {
    return name || ''
  } else {
    const i18n = useI18n()
    return i18n.te(name) ? i18n.t(name) : name
  }
}
