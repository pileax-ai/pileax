<template>
  <o-hover-menu-btn class="timezone-hover-btn"
                    menu-class="pi-menu"
                    min-width="240px"
                    icon="mdi-map-clock-outline"
                    :icon-right="iconRight"
                    :anchor="anchor"
                    :self="self"
                    :label="selectedLabel"
                    :round="round"
                    :outline="outline"
                    :offset="offset"
                    :enable-hover="enableHover">
    <template v-if="current">
      <q-item-label caption>{{ $t('current') }}</q-item-label>
      <o-common-item :label="current.label"
                     :sub-label="`GMT${current.gmt}`"
                     :active="current.value === timezone"
                     clickable closable
                     @click="setTimeZone(current.value)" />

        <q-separator class="bg-accent" />
    </template>
    <q-item-label caption>{{ $t('select') }}</q-item-label>
    <o-common-item v-for="(item, index) in timeZones"
                   :key="index"
                   :label="item.label"
                   :sub-label="`GMT${item.gmt}`"
                   :active="item.value === timezone"
                   clickable closable
                   @click="setTimeZone(item.value)">
    </o-common-item>
  </o-hover-menu-btn>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import OHoverMenuBtn from 'core/components/menu/OHoverMenuBtn.vue'
import useSetting from 'core/hooks/useSetting'
import { Timezones } from 'core/constants/metadata'
import {getArrayItem} from 'core/hooks/useCommon'
import { getCurrentTimeZone, getTimeZones } from 'core/utils/timezone'

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
const { timezone, setTimeZone } = useSetting()
const allTimeZones = getTimeZones()

const current = computed(() => {
  return getCurrentTimeZone()
})

const selectedLabel = computed(() => {
  const item = getArrayItem(timeZones.value, timezone.value) as Indexable
  let localeLabel = i18n.t('locales.timezone')
  if (item) {
    localeLabel = `${item.label} (GMT${item.gmt})`
  }
  return props.showLabel ? localeLabel : ''
})

const timeZones = computed(() => {
  return allTimeZones
    .filter(item => Timezones.some(t => t.value === item?.value))
})

</script>

<style lang="scss">
</style>
