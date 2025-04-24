<template>
  <q-item class="o-navi-item" :class="item.meta?.class" clickable @click="onClick">
    <o-navi-icon :meta="item.meta" v-if="showItemIcon" />
    <q-item-section class="row item-label">
      <q-item-label lines="1">
        {{ menuLabel(item.name) }}
      </q-item-label>
      <div class="absolute-right row items-center q-pr-sm">
        <q-badge color="primary" class="text-white" v-if="item.meta?.tag">
          {{ item.meta.tag }}
        </q-badge>
      </div>
    </q-item-section>
    <q-item-section side v-if="item.action === 3">
      <q-icon name="open_in_new" size="1rem" class="text-info" />
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
import { PropType } from 'vue';

import ONaviIcon from 'core/components/navi/ONaviIcon.vue';
import { MenuItem } from 'core/types/menu';
import { menuLabel } from 'core/hooks/useMenu';
import { onAction } from 'core/hooks/useRouter';

const props = defineProps({
  item: {
    type: Object as PropType<MenuItem>,
    default: () => {
      return {};
    }
  },
  showItemIcon: {
    type: Boolean,
    default: false
  }
});

function onClick() {
  onAction(props.item as Action);
}
</script>

<style lang="scss">
.o-navi-item {
  padding: 0 10px 0 10px;
  min-height: 42px;

  &.highlight {
    color: var(--q-primary);
    font-weight: 600;
  }

  &.active:before {
    content: "";
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    color: var(--q-primary) !important;
    background-color: var(--q-primary);
    opacity: 0.1;
  }

  &.active:after {
    content: "";
    width: 2px;
    position: absolute;
    right: 0;
    top: 10px;
    bottom: 10px;
    background-color: var(--q-primary);
  }
}
</style>
