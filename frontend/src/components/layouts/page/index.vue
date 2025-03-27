<template>
  <q-layout view="hHh Lpr lFf" class="o-layout layout-page">
    <section class="top-navi" v-if="false">
      <modal-entry />
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
import ModalEntry from 'components/modal/ModalEntry.vue';
</script>

<style lang="scss">
  @import "style";
</style>
