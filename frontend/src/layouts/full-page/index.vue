<template>
  <q-layout view="hHh Lpr lFf" class="o-layout layout-common full-page-layout">
    <section class="top-navi" v-if="showToolbar">
      <base-toolbar />
    </section>

    <q-page-container>
      <router-view v-slot="{ Component, route }">
        <keep-alive>
          <component :is="Component" :key="route.path" />
        </keep-alive>
      </router-view>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import BaseToolbar from './toolbar/BaseToolbar.vue';

const route = useRoute();

const showToolbar = computed(() => {
  return route.name != 'signin';
})
</script>

<style lang="scss">
@import "style";
</style>
