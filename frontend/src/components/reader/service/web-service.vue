<template>
  <section class="reader-side-service">
    <o-frame :src="src" />
  </section>
</template>

<script setup lang="ts">
import { computed, onActivated, PropType, ref, watch } from 'vue'
import OFrame from 'core/page/section/OFrame.vue'
import useSetting from 'core/hooks/useSetting'
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

const { keyword, book } = useBook()
const { currentMainService } = useReader()
const { locale } = useSetting()
const src = ref('')

function getUrl() {
  const lang = (book.value.language || locale || 'en').split('-')[0]
  const url = props.item.url?.replaceAll('{LANG}', lang).replaceAll('{word}', keyword.value)
  console.debug('url', lang, url)
  return url
}

watch(keyword, (newValue) => {
  // console.log('keyword', currentMainService.value, props.item, newValue)
  if (currentMainService.value === props.item.value) {
    src.value = getUrl()
  }
})

onActivated(() => {
  src.value = getUrl()
})
</script>

<style lang="scss">
.reader-side-service {

}
</style>
