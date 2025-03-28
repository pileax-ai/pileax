<template>
  <section class="row items-start bg-secondary text-readable bottom-toolbar toolbar-hover-show">
    <template v-if="false">
      <q-btn icon="pending" class="o-toolbar-btn" flat>
        <o-tooltip>Dark Mode</o-tooltip>
      </q-btn>
      <q-btn :icon="themeIcon" class="o-toolbar-btn" flat @click="toggleTheme">
        <o-tooltip>{{$t(themeTooltip)}}</o-tooltip>
      </q-btn>
      <q-btn icon="format_size" class="o-toolbar-btn" flat>
        <o-tooltip>Styles</o-tooltip>
      </q-btn>
    </template>

    <section class="col-12 relative-position slider-container">
      <q-slider v-model="progressValue"
                :min="0" :max="1" :step="0.001"
                :label-value="showReserve ? '预览位置' : '阅读位置'"
                label
                label-always
                track-size="5px"
                :color="showReserve ? 'cyan' : 'primary'"
                @pan="onPan"
                @update:modelValue="onUpdated" />
      <div class="reserve-position cursor-pointer bg-primary"
           :style="`--pi-reserve-percent: ${reservePercent};`"
           @click="onReturn" v-if="showReserve">
        <o-tooltip message="阅读位置" />
      </div>
    </section>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import useSetting from 'core/hooks/useSetting';
import useBook from 'src/hooks/useBook';
import { changeStyle, goToHref, goToPercent } from 'src/service/book';

const { setTheme, theme } = useSetting();
const { store, progress } = useBook();
const progressValue = ref(0);
const phase = ref('');

const reservePercent = computed(() => {
  return `${progress.value.percentage * 100}%`
})

const showReserve = computed(() => {
  return Math.abs(progress.value.percentage - store.tempProgress.percentage) > 0.01;
})

function onUpdated(value: number | null) {
  goToPercent(value || 0);
}

function onPan(value: string) {
  phase.value = value;
}

function onReturn() {
  goToHref(progress.value.cfi);
  progressValue.value = progress.value.percentage;
}

function toggleTheme() {
  const name = (theme.value.name === 'dark') ? 'light' : 'dark';
  setTheme(name);
  changeStyle({
    backgroundColor: name === 'dark' ? '#000000' : '#ffffff',
    fontColor: name === 'dark' ? '#ffffff' : '#000000'
  });
}

const themeIcon = computed(() => {
  return theme.value.name === 'dark' ? 'light_mode' : 'dark_mode';
});
const themeTooltip = computed(() => {
  return theme.value.name === 'dark' ? 'mode.light' : 'mode.dark';
});

watch(() => store.tempProgress, (newValue) => {
  if (phase.value !== 'start') {
    progressValue.value = store.tempProgress.percentage;
  }
})

onMounted(() => {
  progressValue.value = progress.value.percentage;
})
</script>

<style lang="scss">
.bottom-toolbar {
  position: absolute;
  left: 60px;
  right: 60px;
  height: 40px;
  padding: 0;

  &.toolbar-hover-show {
    visibility: hidden;
    //opacity: 1;
    transform: translateY(100%);
    transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out, visibility 0.3s;
  }

  .slider-container {
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
</style>
