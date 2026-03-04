<template>
  <section class="reader-side-service">
    <o-frame :src="src" />
  </section>
</template>

<script setup lang="ts">
import { computed, onActivated, PropType, ref, watch } from 'vue'
import OFrame from 'core/page/section/OFrame.vue'
import useBook from 'src/hooks/useBook'
import useReader from 'src/hooks/useReader'

const props = defineProps({
  item: {
    type: Object,
    default: function () {
      return {}
    }
  }
})

const { keyword } = useBook()
const { currentMainService } = useReader()
const src = ref('')


watch(keyword, (newValue) => {
  // console.log('keyword', currentMainService.value, props.item, newValue)
  if (currentMainService.value === props.item.value) {
    src.value = props.item.url?.replaceAll('{word}', keyword.value)
  }
})

onActivated(() => {
  src.value = props.item.url?.replaceAll('{word}', keyword.value)
})
</script>

<style lang="scss">
.reader-side-service {

}
</style>
