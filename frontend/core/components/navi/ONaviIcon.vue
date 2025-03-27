<template>
  <q-item-section class="text-info o-navi-icon" avatar>
    <q-avatar>
      <template v-if="meta.icon?.indexOf('icon') === 0">
        <svg class="icon" aria-hidden="true" v-if="meta.svg">
          <use :xlink:href="`#${meta.icon}`"></use>
        </svg>
        <i class="iconfont q-icon" :class="meta.icon" v-else />
      </template>
      <q-icon :name="meta.icon" :class="meta.iconClass" v-else />
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
