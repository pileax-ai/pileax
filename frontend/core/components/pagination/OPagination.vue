<template>
  <section class="o-pagination fit">
    <section :class="contentClass">
      <slot :page="pagination"></slot>
    </section>
    <footer class="row col-12 justify-between items-center pagination">
      <section>
        <span>{{ (pageIndex-1) * pageSize + 1 }}</span>
        <span>-</span>
        <span>{{ (pageIndex) * pageSize }}</span>
        <span class="q-mx-xs">/</span>
        <span>{{pagination.total}}</span>
      </section>
      <section class="row items-center pi-pagination">
        <q-btn-dropdown :label="`${sizeAlt}`" class="size-dropdown" flat>
          <q-list>
            <template v-for="(item, index) in sizesAlt" :key="index">
              <o-common-item :label="`${item}`"
                             class="padding"
                             :class="{ 'active': item === sizeAlt }"
                             clickable
                             closable
                             @click="onSize(item)" />
            </template>
          </q-list>
        </q-btn-dropdown>
        <q-pagination v-model="pageIndex"
                      :max="pageMax"
                      :max-pages="isMobile ? 3 : 5"
                      direction-links
                      :boundary-links="!isMobile"
                      flat
                      color="info"
                      active-color="primary"
                      active-design="unelevated"
                      gutter="10px"
                      class=""
                      @update:model-value="onPaged" />
      </section>
    </footer>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, onBeforeMount } from 'vue'
import { isMobile } from 'core/hooks/useCommon'
import usePagination from 'core/hooks/usePagination'

const props = defineProps({
  data: {
    type: Array,
    default: function () {
      return []
    }
  },
  size: {
    type: Number,
    default: 10
  },
  sizes: {
    type: Array,
    default: function () {
      return []
    }
  },
  contentClass: {
    type: String,
    default: ''
  }
})
const emit = defineEmits(['paged'])
const {
  pageIndex,
  pageSize,
  pageMax,
  pagedList,
  pagination,
  initPagination
} = usePagination()

const sizeAlt = ref(10)
const sizesAlt = computed(() => {
  let list = props.sizes
  if (list.length === 0) {
    list = [10, 15, 20, 25, 50, 75, 100]
  }
  if (!list.includes(props.size)) {
    list.unshift(props.size)
  }
  return list
})

function onPaged () {
  emit('paged', pagination)
}

function onSize(value) {
  sizeAlt.value = value
  pageSize.value = value
}

onBeforeMount(() => {
  sizeAlt.value = props.size
  initPagination(props.data, props.size)
})
</script>

<style lang="scss">
.o-pagination {
  .pagination {
    margin-top: 21px;
  }
}
</style>
