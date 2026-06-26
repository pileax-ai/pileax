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
                       :value="book.publisher" align="right" lines="2" v-if="book.publisher" />
          <o-view-item :label="$t('book.published')"
                       :value="book.published.substring(0, 4)" align="right" v-if="book.published" />
          <o-view-item :label="$t('book.format')"
                       :value="book.extension.toUpperCase()" align="right" v-if="book.extension" />
          <o-view-item label="ISBN"
                       :value="book.isbn" align="right" v-if="book.isbn" />
          <o-view-item :label="$t('book.link')"
                       :link="book.refUrl" align="right" v-if="book.refUrl" />

          <section class="description" v-if="book.description">
            <span class="text-readable">{{ $t('description') }}</span>
            <q-scroll-area class="o-book-desc">
              <div v-html="book.description"></div>
            </q-scroll-area>
          </section>

          <footer class="row col-12 justify-center q-mt-md">
            <q-btn icon="mdi-tune-variant"
                   :label="$t('book.metadata._')"
                   class="bg-dark text-info"
                   flat
                   @click="onDetails" />
          </footer>
        </q-card-section>

      </q-card>
    </template>
  </drawer-navi>
</template>

<script setup lang="ts">
import DrawerNavi from 'core/page/DrawerNavi.vue'
import {computed, onBeforeMount, ref, watch} from 'vue'
import useBook from 'src/hooks/useBook'
import useApi from 'src/hooks/useApi'
import useCommon from 'core/hooks/useCommon'

const { showDialog } = useCommon()
const { book, bookId } = useBook()
const { getCoverUrl } = useApi()
const coverUrl = ref('')
const list = ref([])

const props = defineProps({
  width: {
    type: Number,
    default: 300
  },
})

function onDetails() {
  showDialog({
    type: 'book-meta',
    id: bookId.value,
  })
}

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

  .description {
     margin-top: 4px;
   }
}
</style>
