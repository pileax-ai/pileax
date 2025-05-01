<template>
  <drawer-navi class="search-list" header>
    <template #header>
      <q-input v-model="term" class="pi-field"
               placeholder="搜索"
               debounce="800"
               standout dense
               autofocus clearable
               @update:modelValue="onSearch"
               @clear="clearSearch">
        <template #prepend>
          <q-circular-progress
            :value="progress"
            size="24px"
            :thickness="0.25"
            color="primary"
            track-color="accent"
            v-if="progress < 100 && progress > 0"
          />
          <q-icon name="search" v-else />
        </template>
      </q-input>
    </template>
    <template #content>
      <q-list class="list" :style="`width: ${width}px`">
        <div class="row justify-between text-readable" v-if="term">
          <div>搜索结果</div>
          <div>{{ resultCount }}</div>
        </div>
        <o-book-search-item :data="result" @navi="onNavi" />
      </q-list>
    </template>
  </drawer-navi>
</template>

<script setup lang="ts">
import DrawerNavi from 'core/page/DrawerNavi.vue';
import OBookSearchItem from 'src/components/book/OBookSearchItem.vue';

import { computed, onMounted, ref } from 'vue'
import useBook from 'src/hooks/useBook';
import { search, clearSearch } from 'src/service/book'

const { store } = useBook();

const props = defineProps({
  width: {
    type: Number,
    default: 300
  },
});

const term = ref('');
const progress = computed(() => store.search.progress * 100);
const result = computed(() => store.search.result);
const resultCount = computed(() => {
  return result.value.reduce((sum: number, item: Indexable) => sum + item.subitems.length, 0);
});

function onSearch(value: any) {
  if (!value) return;
  search(value, {
    scope: 'book',
    matchCase: false,
    matchDiacritics: false,
    matchWholeWords: false,
  })
}

function onNavi(item: Indexable) {
  store.goResult(item);
}

onMounted(() => {
  store.clearSearch();
  clearSearch();
})
</script>

<style lang="scss">
.search-list {
  nav {
    padding: 0 8px;
    height: unset;
  }

  .with-header {
    top: 40px;
  }

  .list {
    margin-top: 4px;
    padding: 0 8px 8px 8px!important;
  }
  .q-expansion-item {
    .q-item {
      padding: 8px 0;
    }
  }
}
</style>
