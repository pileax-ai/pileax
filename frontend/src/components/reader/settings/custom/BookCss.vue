<template>
  <section class="book-css-settings layout">
    <header class="row col-12 justify-between items-center text-readable">
      <div>
        {{ $t('reading.setting.style.bookCssTips') }}
      </div>
      <div>
        <q-icon name="help"
                size="1.4rem"
                class="text-tips cursor-pointer"
                @click="openGuide('reading/styles/book')">
          <o-tooltip position="left" transition>{{ $t('help') }}</o-tooltip>
        </q-icon>
      </div>
    </header>

    <YiiCodeEditor
      ref="yiiEditor"
      class="layout-content"
      v-bind="editorOptions"
      @update="onUpdate"
      v-if="loaded"
    />

    <footer class="row col-12 justify-center items-center">
      <q-btn :label="$t('save')" class="bg-primary text-white" @click="onSave" flat />
    </footer>
  </section>
</template>

<script setup lang="ts">
import { computed, onActivated, onBeforeMount, onMounted, ref } from 'vue'
import { Editor } from '@tiptap/core'
import {
  YiiCodeEditor,
} from '@yiitap/vue'
import useAccount from 'src/hooks/useAccount'
import useBook from 'src/hooks/useBook'
import useGuide from 'src/hooks/useGuide'
import { changeStyle } from 'src/api/service/ebook/book'
import { bookService, userBookService } from 'src/api/service/remote'

defineProps({
  fixedLayout: {
    type: Boolean,
    default: false
  },
})
const emit = defineEmits(['next'])

const { account } = useAccount()
const { book, bookCss, setBookCss, setBookItem } = useBook()
const { openGuide } = useGuide()
const editingCSS = ref('')
const loaded = ref(false)
const bookDetails = ref<Indexable>({})
const bookExtra = ref<Indexable>({})
const userExtra = ref<Indexable>({})

const bookCSS = computed({
  get() {
    return bookCss.value
  },
  set(value: string) {
    setBookCss(value)
    changeStyle()
  }
})

const editorOptions = computed(() => {
  return {
    editable: true,
    content:
      `<pre><code class="language-css">${editingCSS.value}</code></pre>`,
    pageView: 'page',
  }
})

function onUpdate({ editor, language, code, }: { editor: Editor, language: string, code: string }) {
  editingCSS.value = code
}

function onSave(remote = true) {
  if (remote && bookDetails.value.id) {
    // Save on remote
    // Save to book's extra if user is book owner
    if (bookDetails.value.owner === account.value.id) {
      const extra = {
        ...bookExtra.value,
        css: editingCSS.value
      }
      bookService.update({
        id: bookDetails.value.id,
        extra: extra
      })
      setBookItem('extra', extra)
    } else {
      const extra = {
        ...userExtra.value,
        css: editingCSS.value
      }
      userBookService.update({
        id: book.value.userBookId,
        extra: extra
      })
      setBookItem('userExtra', extra)
    }
  }
  bookCSS.value = editingCSS.value
}

function loadCSS() {
  loaded.value = false
  bookService.getDetails(book.value.id).then(res => {
    bookDetails.value = res
    bookExtra.value = res.extra || {}
    userExtra.value = res.userExtra || {}
  }).finally(() => {
    if (bookCSS.value) {
      editingCSS.value = bookCSS.value
    } else {
      editingCSS.value = userExtra.value.css || bookExtra.value.css || ''
      onSave(false)
    }

    loaded.value = true
  })
}

onActivated(loadCSS)
</script>

<style lang="scss">
.book-css-settings {
  height: calc(100vh - 80px);

  .editor-content {
    padding: 40px 0 60px 0;
  }

  .ProseMirror {
    padding: 0;

    .o-code-block-view {
      margin: 0;

      .code-block-toolbar {
        display: none;
      }

      pre {
        background: transparent;
      }
    }
  }

  header {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 40px;
    padding: 0 1rem !important;
    background: var(--q-secondary) !important;
    z-index: 1;
  }

  footer {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 60px;
    border-top: solid 1px var(--q-accent);
    background: var(--q-secondary);

    .q-btn {
      min-width: 120px;
    }
  }
}
</style>
