<template>
  <section class="o-breadcrumbs"
           :class="`style-${breadcrumb.style}`"
           v-if="breadcrumb.enable && !disable">
    <q-breadcrumbs>
      <template v-for="(item, index) of breadcrumbMenuList" :key="index">
        <q-breadcrumbs-el :label="menuLabel(item.name)"
                          :icon="item?.icon"
                          :class="{'show-icon': breadcrumb.icon}"
                          :to="item.path" />
      </template>
    </q-breadcrumbs>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import { menuLabel } from 'core/hooks/useMenu';
import type { MenuItem } from 'core/types/menu';
import { useAppStore } from 'stores/app';
import { useNaviStore } from 'stores/navi';

const props = defineProps({
  disable: {
    type: Boolean,
    default: false
  },
});

const appStore = useAppStore();
const naviStore = useNaviStore();

const breadcrumb = computed(() => {
  return appStore.setting.breadcrumb;
});

const breadcrumbMenuList = computed(() => {
  const menus = naviStore.menus;
  const currentMenu = naviStore.currentMenu;
  const list = [] as MenuItem[];
  if (currentMenu.path) {
    list.push(currentMenu);
    let parentId = currentMenu.parentId;
    while (parentId && parentId !== 'root') {
      const parentMenu = menus.find(e => e.id === parentId);
      parentId = parentMenu?.parentId;
      if (parentMenu) {
        list.unshift(parentMenu);
      }
    }
  }
  return list;
});
</script>

<style lang="scss">
.o-breadcrumbs {
  padding: 0 10px;
  font-size: 0.9rem;
  opacity: 0.8;

  .q-link:not(.q-router-link--active) {
    opacity: 0.8;
  }

  .q-icon {
    margin-right: 2px;
    display: none;
  }
  .q-breadcrumbs__el.show-icon {
    .q-icon {
      display: inline-flex;
    }
  }

  &.style-tag {
    .q-breadcrumbs__separator {
      display: none;
    }

    .flex {
      margin: 0;
      .flex {
        &:first-child {
          .q-breadcrumbs__el {
            padding-left: 10px;
            margin: 0;
            border-radius: 3px 0 0 3px;
            clip-path: polygon(0 0,calc(100% - 8px) 0,100% 50%,calc(100% - 8px) 100%,0 100%);
          }
        }

        &:last-child {
          .q-breadcrumbs__el {
            padding-right: 10px;
            border-radius: 0 3px 3px 0;
            clip-path: polygon(0 0,100% 0,100% 100%,0 100%,8px 50%);
          }
        }

        .q-breadcrumbs__el {
          background-color:  var(--q-accent);
          padding: 4px 12px;
          margin-left: -6px;
          clip-path: polygon(0 0,calc(100% - 8px) 0,100% 50%,calc(100% - 8px) 100%,0 100%,8px 50%);
        }
      }
    }
  }
}
</style>
