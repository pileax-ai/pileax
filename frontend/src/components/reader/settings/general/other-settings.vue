<template>
  <section class="other-settings">
    <o-field-label label="翻页方式" side>
      <q-select v-model="pageTurnStyle"
                :options="turnStyles"
                map-options emit-value
                outlined dense
                @update:modelValue="onValueChanged('pageTurnStyle', $event)" />
    </o-field-label>
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, ref } from 'vue'

import useReaderSetting from 'src/hooks/useReaderSetting'
const { settings, setSettingItem } = useReaderSetting()
import OFieldLabel from 'core/components/form/field/OFieldLabel.vue'

const pageTurnStyle = ref('slide')

const turnStyles = computed(() => {
  return [
    { label: '左右滑动', value: 'slide', icon: 'public' },
    { label: '上下滚动', value: 'scroll', icon: 'public' },
  ]
})

function onValueChanged(key: string, value: any) {
  setSettingItem(key, value)
}

onBeforeMount(() => {
  pageTurnStyle.value = settings.value.pageTurnStyle || 'slide'
})
</script>

<style lang="scss">
.other-settings {
}
</style>
