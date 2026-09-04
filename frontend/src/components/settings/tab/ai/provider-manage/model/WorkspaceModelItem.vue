<template>
  <o-simple-form-page class="workspace-model-form"
                      :loading="loading"
                      @submit="onSubmit"
                      enable-actions>
    <div class="row col-12 justify-center items-center q-py-md">
      <o-svg-icon :name="provider.logo" size="100px" colored />
    </div>

    <o-field :label="$t('ai.providers.model.name')" required>
      <q-input v-model="form.modelName" :placeholder="$t('ai.providers.model.name')"
               class="pi-field"
               standout dense clearable
               :error="v$.modelName.$errors.length > 0"
               :error-message="$t('required')">
        <template #hint>
          <a href="https://console.volcengine.com/ark/endpoint"
             class="flex items-center"
             style="width: fit-content"
             target="_blank"
             @click.stop
             v-if="provider.name === 'VolcEngine'">
            {{ $t('ai.providers.model.endpoint') }}
            <q-icon name="o_help" class="q-ml-xs" />
            <o-tooltip position="right" transition>
              {{ $t('ai.providers.model.endpointTip') }}
            </o-tooltip>
          </a>
        </template>
      </q-input>
    </o-field>
    <o-field :label="$t('ai.providers.model.alias')">
      <q-input v-model="form.modelAlias" :placeholder="$t('ai.providers.model.alias')"
               class="pi-field"
               standout dense clearable />
    </o-field>
    <o-field :label="$t('ai.providers.model.type')" required>
      <q-select v-model="form.modelType"
                class="pi-field"
                placeholder="Select"
                :options="LLMTypes"
                :error="v$.modelType.$errors.length > 0"
                :error-message="$t('required')"
                map-options
                emit-value
                standout dense />
    </o-field>
    <o-field :label="$t('ai.providers.model.maxTokens')" class="col-6">
      <q-input v-model="form.maxTokens" :placeholder="$t('ai.providers.model.maxTokens')"
               type="number"
               class="pi-field"
               standout dense clearable />
    </o-field>
    <o-field :label="$t('tags')" required>
      <q-input v-model="form.tags" :placeholder="$t('tags')"
               class="pi-field"
               standout dense clearable
               :error="v$.tags.$errors.length > 0"
               :error-message="$t('required')" />
    </o-field>
    <q-toggle v-model="status" :label="$t('enable')" />

  </o-simple-form-page>
</template>

<script setup lang="ts">
import type { PropType} from 'vue'
import { onMounted, ref } from 'vue'
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'

import OSimpleFormPage from 'core/page/template/OSimpleFormPage.vue'
import { GET } from 'src/hooks/useRequest'
import { notifyWarning } from 'core/utils/control'
import useForm from 'src/hooks/useForm'
import useMetadata from 'src/hooks/useMetadata'
import { getErrorMessage } from 'src/utils/request'

const apiName = 'workspaceLLM'
const props = defineProps({
  id: {
    type: String,
    default: ''
  },
  provider: {
    type: Object as PropType<Indexable>,
    default: () => {}
  }
})
const emit = defineEmits(['success'])

const { form, loading, actions } = useForm()
const { LLMTypes } = useMetadata()
const status = ref(true)
const rules = {
  modelName: { required },
  modelType: { required },
  tags: { required },
}
const v$ = useVuelidate(rules, form)

function load () {
  actions.initForm(apiName)
  if (props.id) {
    GET({name: apiName, query: {id: props.id}}).then((res) => {
      form.value = res
      status.value = res.status === 1
    })
  }
}

function onSubmit () {
  if (!actions.validate(v$)) {
    return
  }
  const body = {
    id: props.id,
    provider: props.provider.name,
    modelName: form.value.modelName,
    modelAlias: form.value.modelAlias,
    modelType: form.value.modelType,
    maxTokens: form.value.maxTokens,
    tags: (form.value.tags || '').toUpperCase(),
    status: status.value ? 1 : -1
  }

  actions.submit(body,
    (data) => {
      emit('success')
    },
    (err) => {

      const message = getErrorMessage(err)
      notifyWarning(message)
      console.error(err)
    }
  )
}

onMounted(() => {
  load()
})
</script>

<style lang="scss">
.workspace-model-form {
}
</style>
