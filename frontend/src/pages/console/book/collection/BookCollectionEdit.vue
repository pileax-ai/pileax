<template>
  <o-simple-form-page class="book-collection-edit"
                      :loading="loading"
                      @submit="onSubmit"
                      @reset="actions.reset"
                      enable-actions>
    <q-input v-model="form.id" prefix="ID" outlined dense readonly v-if="form.id && false"/>
    <o-field label="标题">
      <q-input v-model="form.title" placeholder="标题"
               class="pi-field icon"
               standout dense
               :error="v$.title.$errors.length > 0"
               error-message="1-100字符"
               hint="1-100字符">
        <template #prepend>
          <div class="cursor-pointer">
            <o-icon :name="form.icon || '🍃'" :color="form.color" />
            <o-general-icon-menu @emoji="onSelectEmoji"
                                 @icon="onSelectIcon" />
          </div>
        </template>
      </q-input>
    </o-field>
    <o-field class="lax" label="颜色">
      <o-color-select v-model="form.color" />
    </o-field>
    <o-field label="描述">
      <q-input v-model="form.description" placeholder="描述"
               type="textarea"
               class="pi-field"
               maxlength="256" counter
               standout dense />
    </o-field>
    <o-field label="封面" v-if="form.id">
      <o-file-uploader accept=".png,.jpg,.svg"
                       :maxSize="10 * 1024 * 1024"
                       :loading="loading" leading
                       @ready="onLogoReady" />
    </o-field>

    <q-toggle v-model="status" label="启用" class="col-6"/>
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

function onSelectEmoji(options: Indexable) {
  console.log('emoji', options)
  form.value.icon = options.emoji
}

function onSelectIcon(options: Indexable) {
  console.log('icon', options)
  form.value.icon = options.name
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
