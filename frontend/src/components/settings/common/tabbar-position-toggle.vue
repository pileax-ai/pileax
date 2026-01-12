<template>
  <div class="tabbar-position-toggle">
    <q-btn-toggle
      v-model="value"
      no-caps unelevated rounded
      toggle-color="primary"
      color="accent"
      text-color="tips"
      :class="itemClass"
      :options="TAB_BAR_POSITIONS"
      @update:model-value="setTabBar('position', $event)" />
  </div>
</template>

<script setup lang="ts">
import {onBeforeMount, ref} from 'vue'
import useSetting from 'core/hooks/useSetting'
import {TAB_BAR_POSITIONS} from 'core/constants/setting'

defineProps({
  itemClass: {
    type: String,
    default: ''
  }
})
const { tabBar, setTabBar} = useSetting()
const value = ref('')

onBeforeMount(() => {
  value.value = tabBar.value.position
})
</script>

<style lang="scss">
.tabbar-position-toggle {
}
</style>
