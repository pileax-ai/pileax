<template>
  <q-page class="frame-layout">
    <template v-for="(item, index) in iframeMenus" :key="index">
      <o-frame :src="item.link" v-show="item.path === $route.path" />
    </template>
  </q-page>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import useNavi from 'src/hooks/useNavi'
import OFrame from 'core/page/section/OFrame.vue'

const { menus, openedMenus } = useNavi()

// Cache opened iframe only
const iframeMenus = computed(() => {
  return openedMenus.value.filter(e => e.action === 2)
})
</script>

<style lang="scss">
.frame-layout {
}
</style>
