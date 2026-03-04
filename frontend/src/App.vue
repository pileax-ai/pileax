<template>
  <router-view />
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'
import 'virtual:svg-icons/register'
import { initApp } from 'src/app/init'
import { destroyApp } from 'src/app/destroy'

function globalInit() {
  initApp()
}

onMounted(() => {
  globalInit()
})

onBeforeUnmount(() => {
  destroyApp()
})
</script>
