<template>
  <div class="breadcrumb-style-toggle">
    <q-btn-toggle
      v-model="value"
      no-caps unelevated rounded
      toggle-color="primary"
      color="accent"
      text-color="tips"
      :class="itemClass"
      :options="BREADCRUMB_STYLES"
      @update:model-value="setBreadcrumb('style', $event)" />
  </div>
</template>

<script setup lang="ts">
import {onBeforeMount, ref} from 'vue'
import useSetting from 'core/hooks/useSetting'
import {BREADCRUMB_STYLES} from 'core/constants/setting'

defineProps({
  itemClass: {
    type: String,
    default: ''
  }
})

const { breadcrumb, setBreadcrumb} = useSetting()

const value = ref('')

onBeforeMount(() => {
  value.value = breadcrumb.value.style
})
</script>

<style lang="scss">
.breadcrumb-style-toggle {
}
</style>
