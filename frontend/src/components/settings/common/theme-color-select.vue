<template>
  <section class="theme-color-select">
    <template v-for="(item, index) in THEME_COLORS" :key="index">
      <q-btn :icon="`${item.name===theme.color ? 'done' : ''}`"
             :class="`bg-${item.name} ${itemClass}`"
             flat
             @click="setThemeColor(item.name)">
        <o-tooltip>{{$t(`appearances.colors.${item.name}`)}}</o-tooltip>
      </q-btn>
    </template>
  </section>
</template>

<script setup lang="ts">
import useSetting from 'core/hooks/useSetting'
import { THEME_COLORS } from 'core/constants/setting'

const { theme, setThemeColor } = useSetting()

defineProps({
  itemClass: {
    type: String,
    default: ''
  }
})
</script>

<style lang="scss">
.theme-color-select {
  .q-btn {
    color: white;
    width: 20px;
    height: 20px;
    min-height: unset;
    padding: 0;
    border-radius: 2px;

    .q-icon {
      font-size: 14px;
    }
  }
}
</style>
