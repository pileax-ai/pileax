<template>
  <o-hover-menu-btn class="opened-tabs-hover-btn"
                    :icon="icon"
                    anchor="bottom right"
                    self="top right"
                    menu-class="o-menus opened-tabs-menu"
                    min-width="240px"
                    :round="round"
                    :offset="offset"
                    :enable-hover="enableHover"
                    flat>
    <q-input v-model="term"
             placeholder="Search Tab"
             class="search"
             borderless autofocus>
      <template #prepend>
        <q-icon name="search" />
      </template>
      <template #append>
        <q-icon name="close"
                size="1.2rem"
                class="cursor-pointer"
                @click="term=''"
                v-if="term" />
      </template>
    </q-input>
    <q-separator class="bg-accent" />
    <template v-for="(item, index) in filterMenus" :key="index">
      <o-common-item :icon="item.icon"
                     :label="menuLabel(item.name)"
                     :to="item.path"
                     :emoji="item.meta?.type==='note' ? item.meta?.icon || NoteDefaultIcon : ''"
                     class="text-tips"
                     clickable closable right-side>
        <template #side>
          <q-btn icon="close" size="0.6rem" class="close"
                 flat round
                 @click.stop.prevent="closeOpenedMenu(item)" />
        </template>
      </o-common-item>
    </template>
  </o-hover-menu-btn>
</template>

<script setup lang="ts">
import {computed, ref} from 'vue';
import useNavi from 'src/hooks/useNavi';

import OHoverMenuBtn from 'core/components/menu/OHoverMenuBtn.vue';
import { menuLabel } from 'core/hooks/useMenu';
import { NoteDefaultIcon } from 'core/constants/constant';

const props = defineProps({
  enableHover: {
    type: Boolean,
    default: false
  },
  icon: {
    type: String,
    default: 'expand_more'
  },
  round: {
    type: Boolean,
    default: false
  },
  offset: {
    type: Array,
    default: function () {
      return [-4, 8];
    }
  },
});
const term = ref('');

const { openedMenus, currentMenu, closeOpenedMenu } = useNavi();
const filterMenus = computed(() => {
  return term.value
      ? openedMenus.value.filter(e => e.name.toLowerCase().indexOf(term.value.toLowerCase()) >= 0)
      : openedMenus.value;
});
</script>

<style lang="scss">
.opened-tabs-hover-btn {
}

.opened-tabs-menu {
  max-width: 300px !important;
  .search {
    .q-field__inner {
      padding: 0 10px;
    }
  }

  .q-item {
    min-height: 32px;
    border-radius: 0!important;
    .side-label {
      padding-right: 8px;
    }
    .close {
      visibility: hidden;
    }

    &:hover {
      .close {
        visibility: visible;
      }
    }

    &.q-router-link--active {
      background: var(--q-accent);
    }
  }
}
</style>
