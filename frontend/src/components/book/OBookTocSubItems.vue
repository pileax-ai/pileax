<template>
  <section class="o-navi-expansion-sub-items">
    <template v-for="(item, index) of list" :key="`${item.name}-${index}`">
      <o-navi-expansion-item :parent-key="`${parentKey}-${item.name}`"
                             :data="item"
                             :collapse="collapse"
                             :level="level"
                             v-if="item.children?.length" />
      <o-navi-item class="text-info"
                   :class="{'active': currentMenu.id === item.id}"
                   :item="item"
                   :showItemIcon="showItemIcon"
                   v-else />
    </template>
  </section>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import { computed } from 'vue';

import ONaviExpansionItem from 'core/components/navi/ONaviExpansionItem.vue';
import ONaviItem from 'core/components/navi/ONaviItem.vue';
import type { MenuItem } from 'core/types/menu';
import { useNaviStore } from 'stores/navi';

const props = defineProps({
  level: { type: Number, default: 0 },
  parentKey: { type: String, default: '' },
  list: {
    type: Array as PropType<MenuItem[]>,
    default: () => {
      return [];
    }
  },
  collapse: { type: Boolean, default: false },
  showItemIcon: { type: Boolean, default: false },
});

const naviStore = useNaviStore();
const currentMenu = computed(() => naviStore.currentMenu);
</script>

<style lang="scss">
.o-navi-expansion-sub-items {
  .q-item {
    padding-left: 0;
  }
}
</style>
