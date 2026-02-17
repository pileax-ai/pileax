<template>
  <ErrorLayout v-if="globalAccessDenied" />
  <ConsoleLayout v-else>
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
  </ConsoleLayout>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import useSetting from 'core/hooks/useSetting'
import usePage from 'core/hooks/usePage'
import useWorkspace from 'src/hooks/useWorkspace'

const { workspaceId } = useWorkspace()
const { globalAccessDenied } = usePage()

import ConsoleLayout from './layout.vue'
import FrameLayout from './frame-layout.vue'
import ErrorLayout from '../error/index.vue'

const { pageTransition } = useSetting()

const transitionName = computed(() => {
  return pageTransition.value.enable ? pageTransition.value.name : ''
})

</script>
