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
          <header class="header">
            <div class="title">{{book.title}}</div>
            <div class="subtitle text-tips" v-if="book.subtitle">{{book.subtitle}}</div>
          </header>

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

            <o-book-desc :desc="book.description" />
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
import {computed, onBeforeMount, ref, watch} from 'vue'
import useBook from 'src/hooks/useBook'
import useApi from 'src/hooks/useApi'
import useCommon from 'core/hooks/useCommon'
import DrawerNavi from 'core/page/DrawerNavi.vue'
import OBookDesc from 'components/book/OBookDesc.vue'

const { showDialog } = useCommon()
const { book, bookId } = useBook()
const { getCoverUrl } = useApi()
const coverUrl = ref('')

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
    padding-top: 0;

    img {
      height: 100%;
      object-fit: cover;
      border-radius: 4px;
    }
  }

  .meta {

    .header {
      margin-bottom: 10px;
    }

    .title, .subtitle {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      overflow: hidden;
      word-break: break-all;
    }

    .title {
      font-size: 1.1rem;
      font-weight: 600;
      -webkit-line-clamp: 1;
    }
    .subtitle {
      -webkit-line-clamp: 1;
    }
  }

  .description {
     margin-top: 4px;
   }
}
</style>
