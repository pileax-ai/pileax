<template>
  <o-simple-form-page class="book-edit"
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
                         v-if="id" />
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
                   standout dense clearable
                   :error="v$.author.$errors.length > 0"
                   :error-message="$t('formRules.length', {length: '1-100'})"
                   :hint="$t('formRules.length', {length: '1-100'})" />
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
                   standout dense clearable />
        </o-field>
        <o-field :label="$t('book.publisher')">
          <q-input v-model="form.publisher" :placeholder="$t('book.publisher')"
                   class="pi-field"
                   standout dense clearable />
        </o-field>
        <o-field :label="$t('language')">
          <q-input v-model="form.language" placeholder="en, zh"
                   class="pi-field"
                   standout dense clearable />
        </o-field>
      </div>
      <div class="col-6">
        <o-field label="ISBN">
          <q-input v-model="form.isbn" placeholder="9780xxxxxxxxx"
                   class="pi-field"
                   standout dense clearable>
            <template #after>
              <q-btn :label="$t('book.metadata.get')"
                     :disable="!form.isbn"
                     class="bg-primary text-white"
                     flat
                     @click="fetchBookMeta" />
            </template>
          </q-input>
        </o-field>
        <o-field :label="$t('book.published')">
          <q-input v-model="form.published" placeholder="YYYYY-MM"
                   class="pi-field"
                   standout dense clearable />
        </o-field>
        <o-field :label="$t('book.link')">
          <q-input v-model="form.refUrl" :placeholder="$t('book.location')"
                   class="pi-field"
                   standout dense clearable />
        </o-field>
      </div>
    </div>

    <o-field :label="$t('description')" class="desc">
      <q-input v-model="form.description" :placeholder="$t('description')"
               type="textarea"
               class="pi-field max-height"
               maxlength="256" counter
               standout dense clearable />
    </o-field>

    <!-- Category -->
    <o-field-separator :label="$t('book.categoryInfo')"
                       class="q-pb-md" />
    <div class="row col-12 q-col-gutter-md">
      <div class="col">
        <o-field :label="$t('book.tags')">
          <q-input v-model="form.code" :placeholder="$t('book.tag')"
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
                    color="teal" class="rating" />
          <q-input v-model="form.rating" placeholder="8.0"
                   class="pi-field"
                   type="number" step="0.1"
                   standout dense clearable v-if="false" />
        </o-field>
      </div>
    </div>

    <!-- Physical Book -->
    <div class="row col-12 items-center q-mb-md q-col-gutter-md">
      <div class="col">
        <o-field-separator :label="$t('book.mediaType.physical')" />
      </div>
      <div class="col-auto">
        <q-toggle v-model="isPhysical" />
      </div>
    </div>
    <div class="row col-12 q-col-gutter-md" v-if="isPhysical">
      <div class="col-6">
        <o-field :label="$t('book.code')">
          <q-input v-model="form.code" :placeholder="$t('book.code')"
                   class="pi-field"
                   standout dense clearable />
        </o-field>
      </div>
      <div class="col-6">
        <o-field :label="$t('book.location')">
          <q-input v-model="form.location" :placeholder="$t('book.location')"
                   class="pi-field"
                   standout dense clearable />
        </o-field>
      </div>
    </div>
  </o-simple-form-page>
</template>

<script setup lang="ts">
import useVuelidate from '@vuelidate/core'
import {maxLength, minLength, required} from '@vuelidate/validators'
import { onMounted, ref} from 'vue'

import OFileUploader from 'core/components/fIle/OFileUploader.vue'
import OSimpleFormPage from 'core/page/template/OSimpleFormPage.vue'
import OFieldSeparator from 'core/components/form/field/OFieldSeparator.vue'

import useCommon from 'core/hooks/useCommon'
import { notifyWarning } from 'core/utils/control'
import { GET } from 'src/hooks/useRequest'
import useForm from 'src/hooks/useForm'
import useApi from 'src/hooks/useApi'
import { bookService } from 'src/api/service/remote'

const apiName = 'book'
const props = defineProps({
  data: {
    type: Object,
    default: function () {
      return {}
    }
  }
})
const emit = defineEmits(['close', 'success'])
const { t } = useCommon()
const { form, loading, actions } = useForm()
const { getFileUrl } = useApi()
const id = ref('')
const coverUrl = ref('')
const isPhysical = ref(false)
const lockedItems = ref<string[]>([])

const rules = {
  title: { required, minLength: minLength(1), maxLength: maxLength(100) },
  author: { required, minLength: minLength(1), maxLength: maxLength(100) },
}
const v$ = useVuelidate(rules, form)

function load () {
  actions.initForm(apiName)

  id.value = props.data.bookId
  if (id.value) {
    GET({name: apiName, query: {id: id.value}}).then((data) => {
      form.value = data as Indexable
      isPhysical.value = data.isPhysical === 1
    })
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
  coverUrl.value = info.url
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
    coverUrl: coverUrl.value,
    isPhysical: isPhysical.value ? 1 : -1,
    location: form.value.location,
    refUrl: form.value.refUrl,
    isbn: form.value.isbn,
    code: form.value.code,
  }

  actions.submit(body,(data) => {
    emit('close', {
      action: 'edit',
      item: {
        ...props.data,
        author: data.author,
        description: data.description,
        publisher: data.publisher,
        title: data.title,
        coverUrl: data.coverUrl,
        updateTime: data.updateTime,
      }
    })
  })
}

onMounted(() => {
  load()
})
</script>

<style lang="scss">
.book-edit {
  .pi-field {
    .q-icon {
      font-size: 1.2rem;
      cursor: pointer;
    }
  }
  .desc {
    margin-top: 0;
  }

  .rating {
    margin-top: 4px;
  }
}
</style>
