<template>
  <section class="reader-side-ai">
    <chat-section ref="chatRef"
                  ref-type="book"
                  :ref-id="bookId"
                  description="基于本书问答"
                  tag="基于本书"
                  dense v-if="bookId">
    </chat-section>
  </section>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import useBook from 'src/hooks/useBook'
import ChatSection from 'components/chat/ChatSection.vue'

const props = defineProps({
  item: {
    type: Object,
    default: function () {
      return {}
    }
  }
})

const { bookId, keyword } = useBook()
const chatRef = ref<InstanceType<typeof ChatSection>>()

watch(keyword, (newValue) => {
  console.log('keyword', newValue)
  // chatRef.value?.send({
  //   message: newValue
  // })
})
</script>

<style lang="scss">
.reader-side-ai {

}
</style>
