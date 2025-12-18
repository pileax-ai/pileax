<template>
  <o-menu-btn class="text-tips tss-rate-btn"
              menu-class="pi-menu show-side-icon tss-rate-btn-menu"
              :anchor="anchor"
              :self="self"
              :min-width="minWidth"
              flat stack>
    <template #label>
      <slot name="label" />
      <template v-if="rate">
        {{ rate.toFixed(1) }}x
      </template>
      <template v-else>{{ label }}</template>
    </template>
    <slot></slot>

    <template #menu>
      <tss-option-view icon="speed" :label="$t('reading.tts.speedSettings')" content-class="q-pt-xl">
        <q-slider v-model="rate"
                  :min="0.5" :max="3" :step="0.1"
                  :label-value="`${rate}`"
                  label
                  label-always
                  markers
                  marker-labels
                  track-size="10px">
          <template v-slot:marker-label-group="{ markerList }">
            <template v-for="(val, index) in Array.from({ length: 26 }, (_, i) => (0.5 + i * 0.1).toFixed(1))"
                      :key="val">
              <div
                class="cursor-pointer label text-primary text-bold"
                :class="markerList[index].classes"
                :style="markerList[index].style"
                v-if="val === '1.0' || val === '2.0'"
                @click="rate = parseFloat(val)"
              >{{ val }}x</div>
            </template>

            <q-btn
              v-for="val in [0, ((3-0.5)/0.1)]"
              :key="val"
              :class="markerList[val].classes"
              :style="markerList[val].style"
              color="primary"
              :label="val === 0 ? $t('reading.tts.slow') : $t('reading.tts.quick')"
              flat
              @click="rate = val ? 3 : 0.5"
            />
          </template>
        </q-slider>
      </tss-option-view>
    </template>
  </o-menu-btn>
</template>

<script setup lang="ts">
import type { PropType} from 'vue'
import { computed, onMounted, ref } from 'vue'
import OMenuBtn from 'core/components/menu/OMenuBtn.vue'
import TssOptionView from './tss-option-view.vue'
import useTTS from 'src/hooks/useTTS'

const props = defineProps({
  label: {
    type: String,
    default: ''
  },
  anchor: {
    type: String as PropType<PositionType>,
    default: 'bottom left'
  },
  self: {
    type: String as PropType<PositionType>,
    default: 'top left'
  },
  offset: {
    type: Array as PropType<number[]>,
    default: () => {
      return [0, 4]
    }
  },
  minWidth: {
    type: String,
    default: '360px'
  },
})
const emit = defineEmits(['selected'])

const { tts } = useTTS()

const options = computed(() => {
  return [
    { label: 'Edge', value: 'edge' },
    { label: 'System', value: 'browser' },
  ]
})

const rate = computed({
  get: () => parseFloat(tts.options.rate),
  set: (val) => {
    tts.setRate(val)
  }
})

const onSelect = (item: Indexable) => {
  tts.setProvider(item.value)
  console.log('select', item)
}
</script>

<style lang="scss" scoped>
.tss-rate-btn-menu {
  .q-slider {
    .q-slider__marker-labels-container {
      .label {
        top: -56px !important;
      }
      .q-btn {
        transform: unset !important;
        &:first-of-type {
          margin-left: -1rem !important;
        }
        &:last-of-type {
          left: unset!important;
          right: 0 !important;
          margin-right: -1rem !important;
        }
      }
    }
  }
}
</style>
