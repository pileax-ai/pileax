<template>
  <ErrorLayout v-if="globalAccessDenied" />
  <ReaderLayout v-else>
    <router-view v-slot="{ Component, route }">
      <transition appear
                  :name="transitionName"
                  mode="out-in">
        <keep-alive>
          <component :is="Component" :key="route.path" v-if="!route.meta?.isIframe" />
        </keep-alive>
      </transition>
    </router-view>
  </ReaderLayout>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import useSetting from 'core/hooks/useSetting'

import ReaderLayout from './layout.vue'
import ErrorLayout from '../error/index.vue'
import usePage from 'core/hooks/usePage'

const { pageTransition } = useSetting()
const { globalAccessDenied } = usePage()
const transitionName = computed(() => {
  return pageTransition.value.enable ? pageTransition.value.name : ''
})
</script>
