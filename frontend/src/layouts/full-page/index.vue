<template>
  <q-layout view="hHh Lpr lFf" class="o-layout layout-common full-page-layout">
    <q-header class="top-navi full-width">
      <simple-toolbar v-if="showSimpleToolbar" />
      <base-toolbar v-else />
    </q-header>

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
import SimpleToolbar from './toolbar/SimpleToolbar.vue';

const route = useRoute();

const showSimpleToolbar = computed(() => {
  return route.name == 'signin' || route.name == 'signup';
})
</script>

<style lang="scss">
@import "style";
</style>
