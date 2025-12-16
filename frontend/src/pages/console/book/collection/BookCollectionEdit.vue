<template>
  <o-simple-form-page class="book-collection-edit"
                      :loading="loading"
                      @submit="onSubmit"
                      @reset="actions.reset"
                      enable-actions>
    <q-input v-model="form.id" prefix="ID" outlined dense readonly v-if="form.id && false"/>
    <o-field :label="$t('title')">
      <q-input v-model="form.title" :placeholder="$t('title')"
               class="pi-field icon"
               standout dense
               :error="v$.title.$errors.length > 0"
               :error-message="$t('formRules.length', {length: '1-100'})"
               :hint="$t('formRules.length', {length: '1-100'})">
        <template #prepend>
          <div class="cursor-pointer">
            <o-icon :name="form.icon || BookCollectionDefaultIcon" :color="form.color" />
            <o-general-icon-menu @select="onSelectIcon" />
          </div>
        </template>
      </q-input>
    </o-field>
    <o-field class="lax" :label="$t('color')">
      <o-color-select v-model="form.color" />
    </o-field>
    <o-field :label="$t('description')">
      <q-input v-model="form.description" :placeholder="$t('description')"
               type="textarea"
               class="pi-field"
               maxlength="256" counter
               standout dense />
    </o-field>
    <o-field :label="$t('cover')" v-if="form.id">
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
import OGeneralIconMenu from 'components/icon/OGeneralIconMenu.vue'
import OColorSelect from 'core/components/form/OColorSelect.vue'

import { GET } from 'src/hooks/useRequest'
import useForm from 'src/hooks/useForm'
import OField from 'core/components/form/field/OField.vue'
import { BookCollectionDefaultIcon } from 'core/constants/constant'

const apiName = 'bookCollection'
const props = defineProps({
  id: {
    type: String,
    default: ''
  }
})
const emit = defineEmits(['close', 'success'])
const { form, loading, actions } = useForm()
const status = ref(true)

const rules = {
  title: { required, minLength: minLength(1), maxLength: maxLength(100) },
}
const v$ = useVuelidate(rules, form)

function load () {
  actions.initForm(apiName)

  if (props.id) {
    GET({name: apiName, query: {id: props.id}}).then((data) => {
      form.value = data as Indexable
    })
  }
}

function onLogoReady() {
  //
}

function onSelectIcon(options: Indexable) {
  form.value.icon = options.value
}

function onSubmit () {
  if (!actions.validate(v$)) {
    return
  }

  const body = {
    id: form.value.id || props.id,
    title: form.value.title,
    icon: form.value.icon,
    color: form.value.color,
    description: form.value.description,
  }

  actions.submit(body,(data) => {
    emit('close', {
      action: 'book-collection-edit',
    })
  })
}

onMounted(() => {
  load()
})
</script>

<style lang="scss">
.book-collection-edit {
  .icon {
    .q-field__marginal {
      color: unset!important;
    }
  }
}
</style>
