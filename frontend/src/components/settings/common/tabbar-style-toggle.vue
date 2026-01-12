<template>
  <div class="tabbar-style-toggle">
    <q-btn-toggle
      v-model="value"
      no-caps unelevated rounded
      toggle-color="primary"
      color="accent"
      text-color="tips"
      :class="itemClass"
      :options="TAB_BAR_STYLES"
      @update:model-value="setTabBar('style', $event)" />
  </div>
</template>

<script setup lang="ts">
import {onBeforeMount, ref} from 'vue'
import useSetting from 'core/hooks/useSetting'
import { TAB_BAR_STYLES } from 'core/constants/setting'

defineProps({
  itemClass: {
    type: String,
    default: ''
  }
})

const { tabBar, setTabBar} = useSetting()

const value = ref('')

onBeforeMount(() => {
  value.value = tabBar.value.style
})
</script>

<style lang="scss">
.tabbar-style-toggle {
}
</style>
