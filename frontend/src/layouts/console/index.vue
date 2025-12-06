<template>
  <Layout>
    <router-view v-slot="{ Component, route }">
      <transition appear
                  :name="transitionName"
                  mode="out-in">
        <keep-alive>
          <component :is="Component"
                     :key="`${workspaceId}.${route.meta?.keep ? String(route.name) : route.path}`"
                     v-if="!route.meta?.isIframe" />
        </keep-alive>
      </transition>
    </router-view>

    <FrameLayout v-show="$route.meta?.isIframe" />
  </Layout>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import useSetting from 'core/hooks/useSetting';
import useWorkspace from 'src/hooks/useWorkspace'

const { workspaceId } = useWorkspace();

import Layout from './layout.vue';
import FrameLayout from './frame-layout.vue';

const { pageTransition } = useSetting();
const transitionName = computed(() => {
  return pageTransition.value.enable ? pageTransition.value.name : '';
});
</script>
