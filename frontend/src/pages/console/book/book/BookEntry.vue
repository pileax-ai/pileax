<template>
  <o-simple-form-page class="book-entry"
                      :loading="loading"
                      @submit="onSubmit"
                      @reset="actions.reset"
                      :enable-actions="auto || manual">
    <o-field :label="$t('book.media')" required>
      <q-select v-model="media"
                class="pi-field"
                :placeholder="$t('book.media')"
                :options="BookMediaTypes"
                map-options
                emit-value
                standout dense readonly />
    </o-field>
    <o-field label="ISBN">
      <q-input v-model="form.isbn"
               class="pi-field"
               standout dense clearable>
        <template #after>
          <q-btn :label="$t('book.metadata.get')"
                 class="bg-primary text-white"
                 flat
                 @click="fetchBookMeta" />
        </template>
      </q-input>
    </o-field>

    <template v-if="auto || manual">
      <o-field :label="$t('title')" required>
        <q-input v-model="form.title"
                 class="pi-field"
                 standout dense clearable
                 :error="v$.title.$errors.length > 0"
                 :error-message="$t('formRules.length', {length: '1-100'})"
                 :hint="$t('formRules.length', {length: '1-100'})" />
      </o-field>
      <o-field :label="$t('book.author')" required>
        <q-input v-model="form.author"
                 class="pi-field"
                 standout dense clearable
                 :error="v$.author.$errors.length > 0"
                 :error-message="$t('formRules.length', {length: '1-100'})"
                 :hint="$t('formRules.length', {length: '1-100'})" />
      </o-field>
      <o-field :label="$t('book.publisher')" required>
        <q-input v-model="form.publisher" :placeholder="$t('book.publisher')"
                 class="pi-field"
                 standout dense clearable
                 :error="v$.publisher.$errors.length > 0"
                 :error-message="$t('formRules.length', {length: '1-100'})"
                 :hint="$t('formRules.length', {length: '1-100'})" />
      </o-field>
      <o-field :label="$t('description')">
        <q-input v-model="form.description" :placeholder="$t('description')"
                 type="textarea"
                 class="pi-field max-height"
                 maxlength="256" counter autogrow
                 standout dense clearable />
      </o-field>
      <o-field :label="$t('book.location')">
        <q-input v-model="form.location" :placeholder="$t('book.location')"
                 class="pi-field"
                 standout dense clearable />
      </o-field>
      <o-field :label="$t('cover')" v-if="manual">
        <o-file-uploader accept=".png,.jpg,.svg"
                         :preview="form.coverUrl"
                         :maxSize="10 * 1024 * 1024"
                         :loading="loading"
                         leading
                         @uploaded="onUploaded" />
      </o-field>
    </template>
  </o-simple-form-page>
</template>

<script setup lang="ts">
import useVuelidate from '@vuelidate/core'
import {maxLength, required} from '@vuelidate/validators'
import { onMounted, ref} from 'vue'

import OFileUploader from 'core/components/fIle/OFileUploader.vue'
import OSimpleFormPage from 'core/page/template/OSimpleFormPage.vue'

import useCommon from 'core/hooks/useCommon'
import useForm from 'src/hooks/useForm'
import useMetadata from 'src/hooks/useMetadata'
import { SHA1 } from 'core/utils/crypto'
import { notifyWarning } from 'core/utils/control'
import { bookService } from 'src/api/service/remote'

const apiName = 'book'
const emit = defineEmits(['close', 'success'])
const { t } = useCommon()
const { form, loading, actions } = useForm()
const { BookMediaTypes } = useMetadata()
const auto = ref(false)
const manual = ref(false)
const media = ref('physical')
const coverUrl = ref('')

const rules = {
  title: { required, maxLength: maxLength(100) },
  author: { required, maxLength: maxLength(100) },
  publisher: { required, maxLength: maxLength(100) },
}
const v$ = useVuelidate(rules, form)

function load () {
  actions.initForm(apiName)
}

function onUploaded(fileInfo: Indexable) {
  coverUrl.value = fileInfo.url
}

function fetchBookMeta() {
  if (!form.value.isbn) {
    notifyWarning(t('book.warning.inputISBN'))
    return
  }
  bookService.getByISBN(form.value.isbn).then(res => {
    auto.value = true
    manual.value = false
    form.value = res
    coverUrl.value = res.coverUrl
  }).catch(err => {
    if (err.response.status === 409) {
      notifyWarning('book.warning.isbnExists')
    } else if (err.response.status === 404) {
      notifyWarning('book.warning.isbnNotFound')
      manual.value = true
    }
  })
}

function onSubmit () {
  if (!actions.validate(v$)) {
    return
  }
  if (!coverUrl.value) {
    notifyWarning('请上传封面')
    return
  }

  const sha1 = SHA1(form.value.title)
  const body = {
    uuid: sha1,
    title: form.value.title,
    author: form.value.author,
    publisher: form.value.publisher,
    published: form.value.published,
    description: form.value.description,
    language: form.value.language,
    coverUrl: coverUrl.value,
    media: [{
      type: 'physical',
      sha1: sha1,
      coverUrl: coverUrl.value,
    }],
    location: form.value.location,
    isbn: form.value.isbn,
    refUrl: form.value.refUrl,
  }

  actions.submit(body,(res) => {
    emit('close', {
      action: 'add',
      item: res
    })
  })
}

onMounted(() => {
  load()
})
</script>

<style lang="scss">
.book-entry {
}
</style>
