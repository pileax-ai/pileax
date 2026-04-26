<template>
  <o-hover-menu-btn class="theme-hover-btn"
                    menu-class="pi-menu normal"
                    min-width="240px"
                    :icon="icon"
                    :icon-right="iconRight"
                    :anchor="anchor"
                    :self="self"
                    :round="round"
                    :outline="outline"
                    :offset="offset"
                    :enable-hover="enableHover"
                    @click="toggleTheme">
    <o-common-item v-for="(item, index) in themeList"
                   :key="index"
                   :label="$t(`appearances.themes.${item.value}`)"
                   :active="item.value === theme.name"
                   clickable closable
                   @click="setTheme(item.value)">
    </o-common-item>
  </o-hover-menu-btn>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { computed } from 'vue'

import OHoverMenuBtn from 'core/components/menu/OHoverMenuBtn.vue'
import useSetting from 'core/hooks/useSetting'

const props = defineProps({
  enableHover: {
    type: Boolean,
    default: false
  },
  round: {
    type: Boolean,
    default: false
  },
  outline: {
    type: Boolean,
    default: false
  },
  showLabel: {
    type: Boolean,
    default: false
  },
  iconRight: {
    type: String,
    default: ''
  },
  anchor: {
    type: String as PropType<PositionType>,
    default: 'bottom right'
  },
  self: {
    type: String as PropType<PositionType>,
    default: 'top right'
  },
  offset: {
    type: Array,
    default: function () {
      return [0, 8]
    }
  },
})

const { darkMode, themeList, theme, setTheme, toggleTheme } = useSetting()

const icon = computed(() => {
  return darkMode.value ? 'light_mode' : 'dark_mode'
})

</script>

<style lang="scss">
.theme-hover-btn {
}
</style>
