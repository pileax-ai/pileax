<template>
  <section class="book-options layout">
    <section>
      <q-list>
        <q-expansion-item icon="search" :label="$t('reading.setting.options.toolbar')"
                          header-class="header bg-accent"
                          default-opened>
          <div>
            <q-checkbox v-model="instantSearch"
                        :label="$t('reading.setting.options.instantSearch')" />
          </div>
        </q-expansion-item>
        <q-expansion-item icon="visibility" :label="$t('reading.setting.options.visibility')"
                          header-class="header bg-accent"
                          default-opened>
          <div>
            <q-checkbox v-model="hideSup"
                        :label="$t('reading.setting.options.hideSuperscript')" />
          </div>
          <div>
            <q-checkbox v-model="hideSub"
                        :label="$t('reading.setting.options.hideSubscript')" />
          </div>
          <div>
            <q-checkbox v-model="hideRubyTitle"
                        :label="$t('reading.setting.options.hideRubyTitle')" />
          </div>
          <div>
            <q-checkbox v-model="hideParentheticalCitation"
                        :label="$t('reading.setting.options.hideParentheticalCitation')" />
          </div>
          <div>
            <q-checkbox v-model="hideFootnote"
                        :label="$t('reading.setting.options.hideFootnote')" />
          </div>
        </q-expansion-item>
      </q-list>
    </section>
  </section>
</template>

<script setup lang="ts">
import { computed, onActivated, ref } from 'vue'
import useBook from 'src/hooks/useBook'
import useReaderSetting from 'src/hooks/useReaderSetting'
import { changeStyle } from 'src/api/service/ebook/book'
import { bookService, userBookService } from 'src/api/service/remote'

defineProps({
  fixedLayout: {
    type: Boolean,
    default: false
  },
})
const emit = defineEmits(['next'])
const { book, bookHideItems, setBookHideItems, setBookOptions } = useBook()
const { getSettingItem, setSettingItem } = useReaderSetting()
const userExtra = ref<Indexable>({})
const options = ref<Indexable>({})

const hideSup = computed({
  get() {
    return getValue('sup')
  },
  set(value: boolean) {
    setValue('sup', value)
  }
})

const hideSub = computed({
  get() {
    return getValue('sub')
  },
  set(value: boolean) {
    setValue('sub', value)
  }
})

const hideRubyTitle = computed({
  get() {
    return getValue('rubyTitle')
  },
  set(value: boolean) {
    setValue('rubyTitle', value)
  }
})

const hideParentheticalCitation = computed({
  get() {
    return getValue('parentheticalCitation')
  },
  set(value: boolean) {
    setValue('parentheticalCitation', value)
  }
})

const hideFootnote = computed({
  get() {
    return getValue('footnote')
  },
  set(value: boolean) {
    setValue('footnote', value)
  }
})

const instantSearch = computed({
  get() {
    return getSettingItem('instantSearch', false)
  },
  set(value: boolean) {
    setSettingItem('instantSearch', value)
  }
})

const getValue = (key: string) => {
  return (bookHideItems.value || []).includes(key)
}

const setValue = (key: string, value: boolean) => {
  const itemSet = new Set(bookHideItems.value || [])

  if (value) {
    itemSet.add(key)
  } else {
    itemSet.delete(key)
  }
  setBookHideItems(Array.from(itemSet))
  changeStyle()
  saveOption(key, value)
}

const setOptions = () => {
  setBookOptions(options.value)
  changeStyle()
}

function saveOption(key: string, value: any) {
  const extra = {
    ...userExtra.value,
    options: {
      ...options.value,
      [key]: value
    }
  }
  userBookService.update({
    id: book.value.userBookId,
    extra: extra
  })
}

function loadOptions() {
  bookService.getDetails(book.value.id).then(res => {
    userExtra.value = res.userExtra || {}
    options.value = userExtra.value.options || {}
    setOptions()
  }).finally(() => {

  })
}

onActivated(loadOptions)
</script>

<style lang="scss">
.book-options {

}
</style>
