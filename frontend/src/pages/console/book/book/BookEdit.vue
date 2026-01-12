<template>
  <o-simple-form-page class="book-edit"
                      :loading="loading"
                      @submit="onSubmit"
                      @reset="actions.reset"
                      enable-actions>
    <q-input v-model="form.id" prefix="ID" outlined dense readonly v-if="form.id && false"/>
    <o-field :label="$t('name')" required>
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
    <o-field :label="$t('book.publisher')">
      <q-input v-model="form.publisher" :placeholder="$t('book.publisher')"
               class="pi-field"
               standout dense clearable />
    </o-field>
    <o-field :label="$t('description')">
      <q-input v-model="form.description" :placeholder="$t('description')"
               type="textarea"
               class="pi-field"
               maxlength="256" counter
               standout dense clearable />
    </o-field>
    <o-field :label="$t('cover')"
             v-if="form.id">
      <o-file-uploader accept=".png,.jpg,.svg"
                       :maxSize="10 * 1024 * 1024"
                       :loading="loading" leading
                       @ready="onLogoReady" />
    </o-field>

    <q-toggle v-model="status" :label="$t('enable')" class="col-6"/>
  </o-simple-form-page>
</template>

<script setup lang="ts">
import useVuelidate from '@vuelidate/core'
import {maxLength, minLength, required} from '@vuelidate/validators'
import { onMounted, ref} from 'vue'

import OFileUploader from 'core/components/fIle/OFileUploader.vue'
import OSimpleFormPage from 'core/page/template/OSimpleFormPage.vue'

import { GET } from 'src/hooks/useRequest'
import useForm from 'src/hooks/useForm'

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
const { form, loading, actions } = useForm()
const id = ref('')
const status = ref(true)

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
    })
  }
}

function onLogoReady() {
  //
}

function onSubmit () {
  if (!actions.validate(v$)) {
    return
  }

  const body = {
    id: form.value.id || id.value,
    title: form.value.title,
    author: form.value.author,
    publisher: form.value.publisher,
    description: form.value.description,
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
}
</style>
