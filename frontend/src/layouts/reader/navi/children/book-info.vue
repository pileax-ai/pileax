<template>
  <drawer-navi class="book-info">
    <template #content>
      <q-card class="transparent" flat>
        <q-responsive :ratio="1">
          <div class="cover">
            <img :src="coverUrl" />
          </div>
        </q-responsive>
      </q-card>

      <q-card class="meta-card transparent" flat>
        <q-card-section class="meta">
          <header class="title">{{book.title}}</header>
          <o-view-item :label="$t('book.author')"
                       :value="book.author" align="right" lines="2" />
          <o-view-item :label="$t('book.publisher')"
                       :value="book.publisher" align="right" v-if="book.publisher" />
          <o-view-item :label="$t('book.format')"
                       :value="book.extension.toUpperCase()" align="right" v-if="book.extension" />

          <section class="description" v-if="book.description">
            <span class="text-readable">{{ $t('description') }}</span>
            <q-scroll-area>
              <div v-html="book.description"></div>
            </q-scroll-area>
          </section>
        </q-card-section>

      </q-card>
    </template>
  </drawer-navi>
</template>

<script setup lang="ts">
import DrawerNavi from 'core/page/DrawerNavi.vue'
import {computed, onBeforeMount, ref, watch} from 'vue'
import useBook from 'src/hooks/useBook'
import { timeMulti } from 'core/utils/format'
import useApi from 'src/hooks/useApi'

const { book } = useBook()
const { getCoverUrl } = useApi()
const coverUrl = ref('')
const list = ref([])

const props = defineProps({
  width: {
    type: Number,
    default: 300
  },
})

onBeforeMount(() => {
  coverUrl.value = getCoverUrl(book.value)
})
</script>

<style lang="scss">
.book-info {

  .cover {
    width: 100%;
    height: 100%;
    text-align: center;
    padding-top: 1rem;

    img {
      height: 100%;
      border-radius: 4px;
    }
  }
}
</style>
