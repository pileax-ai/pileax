<template>
  <q-item-section class="o-navi-icon" avatar>
    <q-avatar>
      <o-icon :name="meta.icon" :class="meta.iconClass" />
    </q-avatar>
  </q-item-section>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import { MenuItemMeta } from 'core/types/menu';

defineProps({
  meta: {
    type: Object as PropType<MenuItemMeta>,
    default: () => {
      return {};
    }
  }
});
</script>

<style lang="scss">
.o-navi-icon {
  padding: 0;
  min-width: unset;

  .q-avatar {
    //font-size: 32px !important;
  }

  .q-icon {
    font-size: 1.4rem;
  }

  .iconfont {
    font-size: 1.4rem !important;
  }

  svg {
    width: 1.4rem;
    height: 1.4rem;
  }
}
</style>
