<template>
  <o-simple-form-page class="ollama-provider-config"
                      :loading="loading"
                      @submit="onSubmit"
                      enable-actions>
    <o-field :label="$t('name')" required>
      <q-input v-model="form.name" :placeholder="$t('ai.providers.api.namePlaceholder')"
               class="pi-field"
               tabindex="1"
               standout dense clearable autofocus
               :error="v$.name.$errors.length > 0"
               :error-message="$t('required')" />
    </o-field>
    <o-field :label="$t('ai.providers.api.key')">
      <q-input v-model="form.apiKey" :placeholder="$t('ai.providers.api.key')"
               :type="isPwd ? 'password' : 'text'"
               class="pi-field"
               tabindex="2"
               standout dense clearable>
        <template v-slot:append>
          <q-icon
            :name="isPwd ? 'visibility_off' : 'visibility'"
            class="cursor-pointer"
            @click="isPwd = !isPwd"
          />
        </template>
      </q-input>
    </o-field>
    <o-field :label="$t('ai.providers.api.baseUrl')">
      <q-input v-model="form.baseUrl" :placeholder="$t('ai.providers.api.baseUrlPlaceholder')"
               class="pi-field"
               tabindex="3"
               standout dense clearable>
        <template #after>
          <q-btn :label="$t('ai.providers.model.get')"
                 class="bg-primary text-white"
                 flat
                 @click="getModels(true)" />
        </template>
      </q-input>
    </o-field>

    <o-field-separator :label="$t('ai.providers.model._')"
                       class="q-pb-md" />

    <div class="row col-12 q-col-gutter-md">
      <div class="col-6">
        <o-field :label="$t('ai.providers.model.name')" required>
          <q-select v-model="form.modelName"
                    class="pi-field"
                    tabindex="4"
                    placeholder="Select"
                    :options="models"
                    :error="v$.modelName.$errors.length > 0"
                    :error-message="$t('required')"
                    map-options
                    emit-value
                    standout dense />
        </o-field>
      </div>
      <div class="col-6">
        <o-field :label="$t('ai.providers.model.type')" required>
          <q-select v-model="form.modelType"
                    class="pi-field"
                    tabindex="5"
                    placeholder="Select"
                    :options="LLMTypes"
                    :error="v$.modelType.$errors.length > 0"
                    :error-message="$t('required')"
                    map-options
                    emit-value
                    standout dense />
        </o-field>
      </div>
    </div>

    <div class="row col-12 q-col-gutter-md">
      <o-field :label="$t('ai.providers.model.maxTokens')" required class="col-6">
        <q-input v-model="form.maxTokens" :placeholder="$t('ai.providers.model.maxTokens')"
                 type="number"
                 class="pi-field"
                 tabindex="6"
                 standout dense clearable
                 :error="v$.maxTokens.$errors.length > 0"
                 :error-message="$t('required')" />
      </o-field>
    </div>

    <section class="row col-12 q-mt-md q-pa-sm bg-accent text-red error-message" v-if="errorMessage">
      {{ errorMessage }}
    </section>

    <template #control>
      <footer class="row col-12 items-center justify-center bg-accent text-tips">
        {{ $t('ai.providers.api.keyTips') }}
      </footer>
    </template>
  </o-simple-form-page>
</template>

<script setup lang="ts">
import type { PropType} from 'vue'
import { onMounted, ref } from 'vue'
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'

import OSimpleFormPage from 'core/page/template/OSimpleFormPage.vue'
import OFieldSeparator from 'core/components/form/field/OFieldSeparator.vue'
import { GET } from 'src/hooks/useRequest'
import { notifyDone, notifyWarning } from 'core/utils/control'
import useForm from 'src/hooks/useForm'
import useMetadata from 'src/hooks/useMetadata'
import { getErrorMessage } from 'src/utils/request'
import useCommon from 'core/hooks/useCommon'
import { getRequest } from 'src/api/server/api'

const apiName = 'providerCredential'
const props = defineProps({
  id: {
    type: String,
    default: ''
  },
  data: {
    type: Object as PropType<Indexable>,
    default: () => {}
  }
})
const emit = defineEmits(['success'])

const { t } = useCommon()
const { form, loading, actions } = useForm()
const { LLMTypes } = useMetadata()
const isPwd = ref(true)
const errorMessage = ref('')
const rules = {
  name: { required },
  modelType: { required },
  modelName: { required },
  maxTokens: { required },
}
const v$ = useVuelidate(rules, form)

const models = ref<Indexable[]>([])

function load () {
  actions.initForm(apiName)
  form.value.maxTokens = 4096
  if (props.id) {
    GET({name: apiName, query: {id: props.id}}).then((data) => {
      form.value.name = data.name
      form.value.apiKey = data.credential.apiKey
      form.value.baseUrl = data.credential.baseUrl
      getModels()
    })
  } else {
    form.value.baseUrl = 'http://localhost:11434' // default baseUrl
    getModels()
  }
}

function getModels(notify = false) {
  getRequest({ name: form.value.baseUrl, path: '/api/tags' }).then(res => {
    if (res.data.models && res.data.models.length) {
      models.value = res.data.models.map((m: Indexable) => {
        return {
          label: m.name,
          value: m.model
        }
      })
    }

    if (notify) {
      notifyDone()
    }
  }).catch(err => {
    if (notify) {
      notifyWarning(t('app.unableConnect'))
    }
  })
}

function onSubmit () {
  errorMessage.value = ''
  if (!actions.validate(v$)) {
    return
  }
  const body = {
    id: props.id,
    name: form.value.name,
    provider: props.data.name,
    credential: {
      api_key: form.value.apiKey,
      base_url: form.value.baseUrl || props.data.baseUrl || ''
    },
    llm: {
      modelName: form.value.modelName,
      modelType: form.value.modelType,
      maxTokens: form.value.maxTokens,
      tags: form.value.modelType.toUpperCase(),
    }
  }

  actions.submit(
    body,
    (data) => {
      emit('success')
    },
    (err) => {
      errorMessage.value = getErrorMessage(err)
      if (err.response.status === 403) {
        notifyWarning(t('ai.providers.api.keyInvalid'))
      } else {
        notifyWarning(errorMessage.value)
        console.error(err)
      }
    }
  )
}

onMounted(() => {
  load()
})
</script>

<style lang="scss">
.ollama-provider-config {
  .q-field__prefix {
    min-width: 80px;
  }

  .connection {
    .o-badge {
      padding: 8px;
      margin: 0;
      font-size: 1rem;
      .q-icon {
        font-size: 1rem;
      }
    }
  }

  .link {
    font-size: 0.9rem;
  }
}
</style>
