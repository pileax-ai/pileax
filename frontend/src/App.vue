<template>
  <router-view />
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { initApp } from 'src/app/init';

function globalInit() {
  initApp();
}

onMounted(() => {
  globalInit();
});
</script>
