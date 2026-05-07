<template>
  <section class="reader-side-ai">
    <chat-section ref="chatRef"
                  ref-type="book"
                  :ref-id="bookId"
                  :tag="$t('ai.basedOnBook')"
                  dense multi-session v-if="bookId">
    </chat-section>
  </section>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import useBook from 'src/hooks/useBook'
import ChatSection from 'components/chat/ChatSection.vue'
import useReader from 'src/hooks/useReader'

const props = defineProps({
  item: {
    type: Object,
    default: function () {
      return {}
    }
  }
})

const { bookId, keyword } = useBook()
const { currentMainService } = useReader()
const chatRef = ref<InstanceType<typeof ChatSection>>()

watch(keyword, (newValue) => {
  console.log('keyword', currentMainService.value, props.item, newValue)
  if (currentMainService.value === props.item.value) {
    chatRef.value?.setMessage(newValue)
  }
})
</script>

<style lang="scss">
.reader-side-ai {

}
</style>
