<template>
  <section class="bg-secondary text-readable bottom-toolbar toolbar-hover-show">
    <q-btn icon="pending" class="o-toolbar-btn" flat>
      <o-tooltip>Dark Mode</o-tooltip>
    </q-btn>
    <q-btn :icon="themeIcon" class="o-toolbar-btn" flat @click="toggleTheme">
      <o-tooltip>{{$t(themeTooltip)}}</o-tooltip>
    </q-btn>
    <q-btn icon="format_size" class="o-toolbar-btn" flat>
      <o-tooltip>Styles</o-tooltip>
    </q-btn>
  </section>
</template>

<script setup lang="ts">
import {computed} from 'vue';
import useSetting from 'core/hooks/useSetting';
import { changeStyle } from 'src/service/book'

const { setTheme, theme } = useSetting();

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
    opacity: 0;
    transform: translateY(100%);
    transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out, visibility 0.3s;
  }
}
</style>
