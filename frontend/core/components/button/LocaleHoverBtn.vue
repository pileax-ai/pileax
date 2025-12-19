<template>
  <o-hover-menu-btn class="locale-hover-btn"
                    menu-class="pi-menu"
                    min-width="240px"
                    icon="translate"
                    :icon-right="iconRight"
                    :anchor="anchor"
                    :self="self"
                    :label="label"
                    :round="round"
                    :outline="outline"
                    :offset="offset"
                    :enable-hover="enableHover">
    <o-common-item v-for="(item, index) in Locales"
                   :key="index"
                   :label="item.label"
                   :sub-label="item.prompt_name"
                   :active="item.value === locale"
                   clickable closable
                   @click="setLocale(item.value, true)">
    </o-common-item>
  </o-hover-menu-btn>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import OHoverMenuBtn from 'core/components/menu/OHoverMenuBtn.vue'
import useSetting from 'core/hooks/useSetting'
import { Locales } from 'core/constants/metadata'
import {getArrayItem} from 'core/hooks/useCommon'
import useCommon from 'core/hooks/useCommon'

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

const i18n = useI18n()
const { locale, setLocale, setTray } = useSetting()

const label = computed(() => {
  const localeLabel = getArrayItem(Locales, i18n.locale.value).label || i18n.t('language')
  return props.showLabel ? localeLabel : ''
})
</script>

<style lang="scss">
.locale-hover-btn {
}
</style>
