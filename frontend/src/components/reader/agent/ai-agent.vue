<template>
  <section class="reader-side-ai">
    <chat-section ref="chatRef"
                  ref-type="book"
                  :ref-id="bookId"
                  :tag="$t('ai.basedOnBook')"
                  :get-extra="getExtra"
                  :on-chat-done="onChatDone"
                  dense
                  multi-session
                  nav
                  v-if="bookId">
    </chat-section>
  </section>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import useBook from 'src/hooks/useBook'
import ChatSection from 'components/chat/ChatSection.vue'
import useReader from 'src/hooks/useReader'
import { globalBus } from 'src/api/event/event-bus'

const props = defineProps({
  item: {
    type: Object,
    default: function () {
      return {}
    }
  }
})

const {
  bookId,
  keyword,
  progress,
  selection,
  reduceCurrentLocation,
  setAnnotation,
} = useBook()
const { currentMainService } = useReader()
const chatRef = ref<InstanceType<typeof ChatSection>>()
const aiAnnotation = ref<Indexable>({})

function getExtra(message: string) {
  const location = reduceCurrentLocation(message)
  aiAnnotation.value = location.selection
    ? {
      type: 'ai',
      style: 'squiggly',
      color: 'purple',
      value: selection.value.cfi,
      page: progress.value.location?.current || 0,
      chapter: progress.value.tocItem?.label,
      title: message,
    }
    : {}
  return location
}

function onChatDone(chat: Indexable) {
  if (chat.message === aiAnnotation.value.title) {
      setAnnotation({
        ...aiAnnotation.value,
        extra: {
          refType: 'ai',
          refId: chat.id
        }
      })
  }
}

function naviTo(id: string) {
  if (id && currentMainService.value === props.item.value) {
    chatRef.value?.naviTo(id)
  }
}

watch(keyword, (newValue) => {
  // console.log('keyword', currentMainService.value, props.item, newValue)
  if (currentMainService.value === props.item.value) {
    chatRef.value?.setMessage(newValue)
  }
})

onMounted(() => {
  globalBus.on('reader-ai-navi', naviTo)
})

onUnmounted(() => {
  globalBus.off('reader-ai-navi', naviTo)
})
</script>

<style lang="scss">
.reader-side-ai {

}
</style>
