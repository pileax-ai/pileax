<template>
  <section class="reader-side-ai">
<!--    {{bookId}}-->
    <chat-section ref-type="book"
                  :ref-id="bookId"
                  description="基于本书问答"
                  tag="基于本书"
                  dense v-if="bookId">
    </chat-section>
  </section>
</template>

<script setup lang="ts">
import {computed, PropType} from 'vue';
import useBook from 'src/hooks/useBook';
import ChatSection from 'components/chat/ChatSection.vue'

const props = defineProps({
  item: {
    type: Object,
    default: function () {
      return {};
    }
  }
});

const { bookId, keyword } = useBook();

const src = computed(() => {
  const url = props.item.url;
  return url?.replaceAll('{word}', keyword.value);
});
</script>

<style lang="scss">
.reader-side-ai {

}
</style>
