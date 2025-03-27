<template>
  <q-btn class="toggle-theme-btn"
         :icon="icon"
         @click="toggle"
         round flat>
    <q-tooltip class="bg-primary text-white">
      {{$t(tooltip)}}
    </q-tooltip>
  </q-btn>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import useSetting from 'core/hooks/useSetting';
const { setTheme, theme } = useSetting();

function toggle() {
  const name = (theme.value.name === 'dark') ? 'light' : 'dark';
  setTheme(name);
}

const icon = computed(() => {
  return theme.value.name === 'dark' ? 'light_mode' : 'dark_mode';
});
const tooltip = computed(() => {
  return theme.value.name === 'dark' ? 'mode.light' : 'mode.dark';
});
</script>

<style lang="scss">
</style>
