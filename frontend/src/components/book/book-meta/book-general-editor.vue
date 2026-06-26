<template>
  <o-simple-form class="book-general-editor"
                 :loading="loading"
                 @submit="onSubmit"
                 @reset="actions.reset"
                 enable-actions>
    <div class="row col-12 q-col-gutter-md">
      <div class="col-auto">
        <o-file-uploader accept=".png,.jpg,.svg"
                         :maxSize="10 * 1024 * 1024"
                         :preview="getFileUrl(form.coverUrl)"
                         :loading="loading"
                         :ref-id="id"
                         ref-type="book"
                         @uploaded="onCoverUpload"
                         v-if="id">
          <div class="row col-12 justify-end items-center header">
            <q-btn :icon="lockedItems.includes('coverUrl') ? 'lock' : 'lock_open'"
                   class="pi-toolbar-btn"
                   flat
                   @click="onToggleItem('coverUrl')" />
            <o-menu-btn icon="image"
                        class="pi-toolbar-btn"
                        anchor="top right" self="top left"
                        min-width="530px" :offset="[4, 12]" flat icon-only>
              <template #menu>
                <book-cover-picker :data="form" @pick="onCoverPick" v-if="form.id" />
              </template>
            </o-menu-btn>
          </div>
        </o-file-uploader>
      </div>
      <div class="col">
        <o-field :label="$t('book.title')" required>
          <q-input v-model="form.title"
                   class="pi-field"
                   standout dense
                   :error="v$.title.$errors.length > 0"
                   :error-message="$t('formRules.length', {length: '1-100'})"
                   :hint="$t('formRules.length', {length: '1-100'})">
            <template #append>
              <q-icon :name="lockedItems.includes('title') ? 'lock' : 'lock_open'"
                      @click="onToggleItem('title')" />
            </template>
          </q-input>
        </o-field>
        <o-field :label="$t('book.author')" required>
          <q-input v-model="form.author"
                   class="pi-field"
                   standout dense
                   :error="v$.author.$errors.length > 0"
                   :error-message="$t('formRules.length', {length: '1-100'})"
                   :hint="$t('formRules.length', {length: '1-100'})">
            <template #append>
              <q-icon :name="lockedItems.includes('author') ? 'lock' : 'lock_open'"
                      @click="onToggleItem('author')" />
            </template>
          </q-input>
        </o-field>
      </div>
    </div>

    <!-- Basic Info -->
    <o-field-separator :label="$t('book.basicInfo')"
                       class="q-py-md" />
    <div class="row col-12 q-col-gutter-md">
      <div class="col-6">
        <o-field :label="$t('book.subtitle')">
          <q-input v-model="form.subtitle" :placeholder="$t('book.subtitle')"
                   class="pi-field"
                   standout dense>
            <template #append>
              <q-icon :name="lockedItems.includes('subtitle') ? 'lock' : 'lock_open'"
                      @click="onToggleItem('subtitle')" />
            </template>
          </q-input>
        </o-field>
        <o-field :label="$t('book.publisher')">
          <q-input v-model="form.publisher" :placeholder="$t('book.publisher')"
                   class="pi-field"
                   standout dense>
            <template #append>
              <q-icon :name="lockedItems.includes('publisher') ? 'lock' : 'lock_open'"
                      @click="onToggleItem('publisher')" />
            </template>
          </q-input>
        </o-field>
        <o-field :label="$t('language')">
          <q-input v-model="form.language" placeholder="en, zh"
                   class="pi-field"
                   standout dense>
            <template #append>
              <q-icon :name="lockedItems.includes('language') ? 'lock' : 'lock_open'"
                      @click="onToggleItem('language')" />
            </template>
          </q-input>
        </o-field>
      </div>
      <div class="col-6">
        <o-field label="ISBN">
          <q-input v-model="form.isbn" placeholder="9780xxxxxxxxx"
                   class="pi-field"
                   standout dense clearable>
            <template #after>
              <q-btn icon="search"
                     :disable="!form.isbn"
                     class="bg-primary text-white"
                     flat
                     @click="fetchBookMeta">
                <o-tooltip position="left" transition>
                  {{ $t('book.metadata.get') }}
                </o-tooltip>
              </q-btn>
            </template>
          </q-input>
        </o-field>
        <o-field :label="$t('book.published')">
          <q-input v-model="form.published" placeholder="YYYYY-MM"
                   class="pi-field"
                   standout dense>
            <template #append>
              <q-icon :name="lockedItems.includes('published') ? 'lock' : 'lock_open'"
                      @click="onToggleItem('published')" />
            </template>
          </q-input>
        </o-field>
        <o-field :label="$t('book.link')">
          <q-input v-model="form.refUrl" :placeholder="$t('book.link')"
                   class="pi-field"
                   standout dense clearable>
            <template #append>
              <q-icon :name="lockedItems.includes('refUrl') ? 'lock' : 'lock_open'"
                      @click="onToggleItem('refUrl')" />
            </template>
          </q-input>
        </o-field>
      </div>
    </div>

    <o-field :label="$t('description')" class="desc">
      <q-input v-model="form.description" :placeholder="$t('description')"
               type="textarea"
               class="pi-field max-height"
               maxlength="256" counter
               standout dense clearable>
        <template #append>
          <q-icon :name="lockedItems.includes('description') ? 'lock' : 'lock_open'"
                  @click="onToggleItem('description')" />
        </template>
      </q-input>
    </o-field>

    <!-- Category -->
    <o-field-separator :label="$t('book.categoryInfo')"
                       class="q-pb-md" />
    <div class="row col-12 q-col-gutter-md">
      <div class="col-4">
        <o-field label="CLC">
          <template #label>
            <q-icon name="mdi-help-circle-outline" class="q-ml-xs text-tips">
              <q-tooltip>Chinese Library Classification</q-tooltip>
            </q-icon>
          </template>
          <q-input v-model="form.clcCode" placeholder="TP311.5"
                   class="pi-field"
                   standout dense clearable />
        </o-field>
      </div>
      <div class="col-4">
        <o-field label="DDC">
          <template #label>
            <q-icon name="mdi-help-circle-outline" class="q-ml-xs text-tips">
              <q-tooltip>Dewey Decimal Classification</q-tooltip>
            </q-icon>
          </template>
          <q-input v-model="form.ddcCode" placeholder="332.6"
                   class="pi-field"
                   standout dense clearable />
        </o-field>
      </div>
      <div class="col-4">
        <o-field :label="$t('book.rating')">
          <q-slider v-model="form.rating"
                    :min="0" :max="10" :step="0.1"
                    label
                    :label-value="`${form.rating}`"
                    label-always
                    color="primary"
                    class="rating" />
        </o-field>
      </div>
    </div>

    <template #actions>
      <q-btn class="bg-dark text-info"
             :label="$t('cancel')"
             :loading="loading"
             flat @click="emit('view')" />
    </template>
  </o-simple-form>
</template>

<script setup lang="ts">
import useVuelidate from '@vuelidate/core'
import {maxLength, minLength, required} from '@vuelidate/validators'
import { onActivated, onMounted, type PropType, ref } from 'vue'

import OSimpleForm from 'core/page/section/OSimpleForm.vue'
import OFileUploader from 'core/components/fIle/OFileUploader.vue'
import OFieldSeparator from 'core/components/form/field/OFieldSeparator.vue'
import OMenuBtn from 'core/components/menu/OMenuBtn.vue'
import BookCoverPicker from './book-cover-picker.vue'

import useCommon from 'core/hooks/useCommon'
import { notifyDone, notifyWarning } from 'core/utils/control'
import { GET } from 'src/hooks/useRequest'
import useForm from 'src/hooks/useForm'
import useApi from 'src/hooks/useApi'
import { bookService } from 'src/api/service/remote'
import { globalBus } from 'src/api/event/event-bus'

const apiName = 'book'
const props = defineProps({
  bookId: {
    type: String,
    default: ''
  },
})
const emit = defineEmits(['view'])

const { t } = useCommon()
const { form, loading, actions } = useForm()
const { getFileUrl } = useApi()
const id = ref('')
const lockedItems = ref<string[]>(['coverUrl', 'language'])

const rules = {
  title: { required, minLength: minLength(1), maxLength: maxLength(100) },
  author: { required, minLength: minLength(1), maxLength: maxLength(100) },
}
const v$ = useVuelidate(rules, form)

function load () {
  console.log('load')
  actions.initForm(apiName)

  id.value = props.bookId
  if (id.value) {
    GET({name: apiName, query: {id: id.value}}).then(res => {
      form.value = res as Indexable
    })

    queryCover()
  }
}

function onToggleItem(name: string) {
  const index = lockedItems.value.indexOf(name)

  if (index !== -1) {
    lockedItems.value.splice(index, 1)
  } else {
    lockedItems.value.push(name)
  }
}

function onCoverUpload(info: Indexable) {
  form.value.coverUrl = info.url
}

function onCoverPick(url: string) {
  form.value.coverUrl = url
}

function queryCover() {
  bookService.queryCover(id.value).then(res => {
    // console.log('cover', res)
  })
}

function fetchBookMeta() {
  if (!form.value.isbn) {
    notifyWarning(t('book.warning.inputISBN'))
    return
  }
  bookService.getByISBN(form.value.isbn, false).then(res => {
    for (const [key, value] of Object.entries(res)) {
      if (!lockedItems.value.includes(key)) {
        form.value[key] = value
      }
    }
  }).catch(err => {
    if (err.response.status === 409) {
      notifyWarning(t('book.warning.isbnExists'))
    } else if (err.response.status === 404) {
      notifyWarning(t('book.warning.isbnNotFound'))
    }
  })
}

function onSubmit () {
  if (!actions.validate(v$)) {
    return
  }

  const body = {
    id: form.value.id || id.value,
    title: form.value.title,
    subtitle: form.value.subtitle,
    author: form.value.author,
    publisher: form.value.publisher,
    published: form.value.published,
    language: form.value.language,
    description: form.value.description,
    rating: form.value.rating,
    coverUrl: form.value.coverUrl,
    refUrl: form.value.refUrl,
    isbn: form.value.isbn,
    clcCode: form.value.clcCode,
    ddcCode: form.value.ddcCode,
  }

  actions.submit(body,(res) => {
    form.value = res as Indexable
    notifyDone()
    globalBus.emit('library-need-refresh', res)
    emit('view')
  })
}

onMounted(load)
</script>

<style lang="scss">
.book-general-tab {
  .pi-field {
    .q-icon {
      font-size: 1.2rem;
      cursor: pointer;
    }
    .q-btn .q-icon {
      font-size: 1.6rem;
    }
  }
  .desc {
    margin-top: 0;
  }

  .rating {
    margin-top: 4px;
  }

  .o-file-uploader {
    &:hover {
      .header {
        visibility: visible;
      }
    }

    .header {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 28px;
      z-index: 1;
      padding: 0;
      background: rgba(0,0,0,0.5);
      color: white;
      gap: 4px;
      visibility: hidden;
    }
  }
}
</style>
