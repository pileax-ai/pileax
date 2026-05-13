<template>
  <footer class="row items-center justify-center read-footer"
          :class="{ 'can-hover': !searchCurrent.top }">
    <span class="text-cyan"  v-if="showReserve">
      {{ tempProgress.location?.current }} / {{ tempProgress.location?.total }}
    </span>
    <span class="text-tips" v-else>
      {{ progress.location?.current }} / {{ progress.location?.total }}
    </span>

    <section class="row items-center text-readable bottom-toolbar toolbar-hover-show">
      <div class="row col-auto q-px-sm">
        <q-btn icon="keyboard_double_arrow_left" class="o-toolbar-btn hover-show" flat @click="prevSection">
          <o-tooltip :message="$t('reading.prevSection')" />
        </q-btn>
        <q-btn icon="chevron_left" class="o-toolbar-btn hover-show" flat @click="prevSection">
          <o-tooltip :message="$t('reading.prevPage')" />
        </q-btn>
      </div>

      <section class="col relative-position slider-container">
        <q-slider v-model="progressValue"
                  :min="0" :max="1" :step="0.001"
                  :label-value="showReserve ? $t('reading.previewPosition') : $t('reading.position')"
                  label
                  label-always
                  track-size="5px"
                  :color="showReserve ? 'cyan' : 'primary'"
                  @pan="onPan"
                  @update:modelValue="onUpdated" />
        <div class="reserve-position cursor-pointer bg-primary"
             :style="`--pi-reserve-percent: ${reservePercent};`"
             @click="onReturn" v-if="showReserve">
          <o-tooltip :message="$t('reading.position')" />
        </div>
      </section>

      <div class="row col-auto q-px-sm">
        <q-btn icon="o_headphones" class="o-toolbar-btn"
               :class="{ 'active': rightDrawer.tts }"
               flat
               @click="toggleRightDrawerView('tts')">
          <o-tooltip position="bottom" transition autohide>
            {{ $t('reading.aiReading') }}
          </o-tooltip>
        </q-btn>
        <q-btn icon="chevron_right" class="o-toolbar-btn hover-show" flat @click="nextPage">
          <o-tooltip :message="$t('reading.nextPage')" />
        </q-btn>
        <q-btn icon="keyboard_double_arrow_right" class="o-toolbar-btn hover-show" flat @click="nextSection">
          <o-tooltip :message="$t('reading.nextSection')" />
        </q-btn>
      </div>
    </section>

    <transition appear
                enter-active-class="animated slideInUp"
                leave-active-class="animated slideOutDown">
      <section class="row justify-center bg-secondary searching o-page-container"
               v-if="searchCurrent.top">
        <section class="row justify-between items-center text-readable toolbar">
          <div>
            <q-btn icon="west" :label="$t('reading.search.prev')" flat
                   @click="store.previousResult" />
          </div>
          <div>
            <q-btn icon-right="east" :label="$t('reading.search.next')" flat
                   @click="store.nextResult" />
          </div>
        </section>
      </section>
    </transition>
  </footer>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import useSetting from 'core/hooks/useSetting'
import useBook from 'src/hooks/useBook'
import {
  changeStyle,
  goToHref,
  goToPercent,
  nextPage,
  prevPage,
  nextSection,
  prevSection,
} from 'src/api/service/ebook/book'
import useCommon from 'core/hooks/useCommon'
import useReader from 'src/hooks/useReader'

const { t } = useCommon()
const { setTheme, theme } = useSetting()
const { store, progress, tempProgress, search } = useBook()
const {
  rightDrawer,
  toggleRightDrawerView,
} = useReader()
const progressValue = ref(0)
const phase = ref('')

const reservePercent = computed(() => {
  return `${progress.value.percentage * 100}%`
})

const showReserve = computed(() => {
  return Math.abs(progress.value.percentage - store.tempProgress.percentage) > 0.01
})

const searchCurrent = computed(() => {
  return search.value.current || {} as Indexable
})

function onUpdated(value: number | null) {
  goToPercent(value || 0)
}

function onPan(value: string) {
  phase.value = value
}

function onReturn() {
  goToHref(progress.value.cfi)
  progressValue.value = progress.value.percentage
}

function toggleTheme() {
  const name = (theme.value.name === 'dark') ? 'light' : 'dark'
  setTheme(name)
  changeStyle({
    backgroundColor: name === 'dark' ? '#000000' : '#ffffff',
    fontColor: name === 'dark' ? '#ffffff' : '#000000'
  })
}

const themeIcon = computed(() => {
  return theme.value.name === 'dark' ? 'light_mode' : 'dark_mode'
})
const themeTooltip = computed(() => {
  return theme.value.name === 'dark' ? 'mode.light' : 'mode.dark'
})

watch(() => store.tempProgress, (newValue) => {
  if (phase.value !== 'start') {
    progressValue.value = store.tempProgress.percentage
  }
})

onMounted(() => {
  progressValue.value = progress.value.percentage
})
</script>

<style lang="scss">
.read-footer {
  position: absolute;
  left: 0;
  bottom: 0;

  .bottom-toolbar {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    height: 40px;
    padding: 0;
    background: var(--q-secondary);

    &.toolbar-hover-show {
      visibility: hidden;
      //opacity: 1;
      transform: translateY(100%);
      transition: transform 0.2s ease-in-out, opacity 0.2s ease-in-out, visibility 0.2s;
    }

    .slider-container {
      padding: 0 8px;
      .reserve-position {
        position: absolute;
        top: 6px;
        left: calc(var(--pi-reserve-percent) - 9px);
        width: 16px;
        height: 16px;
        border-radius: 8px;

        &:after {
          content: "";
          position: absolute;
          top: 50%;
          left: 50%;
          width: 100%;
          height: 100%;
          background: var(--q-primary);
          border-radius: 50%;
          transform: translate(-50%, -50%) scale(2);
          opacity: 0.1;
        }

        &:hover:after {
          opacity: 0.3;
          transition: transform 0.5s ease-out, opacity 0.5s ease-out;
        }
      }
    }
  }

  .searching {
    position: absolute;

    .toolbar {
      width: 100%;
      max-width: 800px;
      padding: 0;
      background: var(--q-dark);
      border-radius: 8px 8px 0 0;

      .title {
        font-size: 1rem;
      }
    }
  }
}
</style>
