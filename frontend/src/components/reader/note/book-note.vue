<template>
  <section class="book-note bg-secondary no-drag-region">
    <header class="row col-12 justify-between items-center text-readable">
      <section class="col row items-center">
        <q-icon name="o_article" size="20px" />
        <span class="q-px-sm">
          {{ $t('note.add') }}
        </span>
      </section>

      <section class="col-auto">
        <q-btn icon="close" class="o-toolbar-btn" flat @click="emit('close')" />
      </section>
    </header>
    <q-scroll-area class="o-scroll-wrapper">
      Note
    </q-scroll-area>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'

import useBook from 'src/hooks/useBook'
import useApi from 'src/hooks/useApi'
import useSetting from 'core/hooks/useSetting'

const emit = defineEmits(['close'])

const { getCoverUrl } = useApi()
const {
  book,
} = useBook()
const { theme } = useSetting()

onMounted(async () => {
  //
})

onUnmounted(() => {
  //
})
</script>

<style lang="scss">
.book-note {
}
</style>
