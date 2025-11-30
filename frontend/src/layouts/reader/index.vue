<template>
  <Layout>
    <router-view v-slot="{ Component, route }">
      <transition appear
                  :name="transitionName"
                  mode="out-in">
        <keep-alive>
          <component :is="Component" :key="route.path" v-if="!route.meta?.isIframe" />
        </keep-alive>
      </transition>
    </router-view>
  </Layout>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import useSetting from 'core/hooks/useSetting';

import Layout from './layout.vue';

const { pageTransition } = useSetting();
const transitionName = computed(() => {
  return pageTransition.value.enable ? pageTransition.value.name : '';
});
</script>
