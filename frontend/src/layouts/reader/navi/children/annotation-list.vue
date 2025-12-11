<template>
  <drawer-navi class="annotation-navi-list">
    <template #content>
      <q-list class="list" :style="`width: ${width}px`" v-if="list.length">
        <template v-for="(item, index) in list" :key="index">
          <o-book-annotation-item :item="item" />
        </template>
      </q-list>
      <section class="text-readable text-center" v-else>
        <o-no-data message="No annotations" />
      </section>
    </template>
  </drawer-navi>
</template>

<script setup lang="ts">
import DrawerNavi from 'core/page/DrawerNavi.vue'
import OBookAnnotationItem from 'src/components/book/OBookAnnotationItem.vue'
import {computed, onBeforeMount, ref, watch} from 'vue'
import useBook from 'src/hooks/useBook'
import { findBookAnnotation } from 'src/api/service/ebook/book-annotation'

const { bookId, annotationTimer } = useBook()
const list = ref([])

const props = defineProps({
  width: {
    type: Number,
    default: 300
  },
})

function query() {
  findBookAnnotation(bookId.value).then(res => {
    list.value = res as []
    console.log('list', list.value)
  })
}

watch(() => annotationTimer.value, (newValue) => {
  query()
})

onBeforeMount(() => {
  query()
})
</script>

<style lang="scss">
.annotation-navi-list {

  .q-item {
    border-radius: 4px;
    margin-top: 2px;

    &.active:before {
      border-radius: 4px;
    }
  }
}
</style>
