<template>
  <o-simple-form-page class="volcengine-provider-config"
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
    <o-field :label="$t('ai.providers.api.key')" required>
      <q-input v-model="form.apiKey" :placeholder="$t('ai.providers.api.key')"
               :type="isPwd ? 'password' : 'text'"
               class="pi-field"
               tabindex="2"
               standout dense clearable
               :error="v$.apiKey.$errors.length > 0"
               :error-message="$t('required')">
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
               standout dense clearable />
    </o-field>

    <o-field-separator :label="$t('ai.providers.model._')"
                       class="q-pb-md" v-if="false" />

    <q-expansion-item v-model="modelRequired" :label="$t('ai.providers.model._')"
                      class="model">
      <div class="row col-12 q-col-gutter-md">
        <div class="col-6">
          <o-field :label="$t('ai.providers.model.name')" required>
            <q-input v-model="form.modelName"
                     class="pi-field"
                     tabindex="4"
                     :error="mv$.modelName.$errors.length > 0"
                     :error-message="$t('required')"
                     standout dense clearable>
              <template #hint>
                <a href="https://console.volcengine.com/ark/endpoint"
                   class="flex items-center"
                   style="width: fit-content"
                   target="_blank"
                   @click.stop>
                  {{ $t('ai.providers.model.endpoint') }}
                  <q-icon name="o_help" class="q-ml-xs" />
                  <o-tooltip position="right" transition>
                    {{ $t('ai.providers.model.endpointTip') }}
                  </o-tooltip>
                </a>
              </template>
            </q-input>
          </o-field>
        </div>
        <div class="col-6">
          <o-field :label="$t('ai.providers.model.alias')">
            <q-input v-model="form.modelAlias"
                     class="pi-field"
                     tabindex="4"
                     standout dense clearable />
          </o-field>
        </div>
      </div>

      <div class="row col-12 q-pt-sm q-col-gutter-md">
        <div class="col-6">
          <o-field :label="$t('ai.providers.model.type')" required>
            <q-select v-model="form.modelType"
                      class="pi-field"
                      tabindex="5"
                      placeholder="Select"
                      :options="LLMTypes"
                      :error="mv$.modelType.$errors.length > 0"
                      :error-message="$t('required')"
                      map-options
                      emit-value
                      standout dense />
          </o-field>
        </div>
        <div class="col-6">
          <o-field :label="$t('ai.providers.model.maxTokens')" required>
            <q-input v-model="form.maxTokens" :placeholder="$t('ai.providers.model.maxTokens')"
                     type="number"
                     class="pi-field"
                     tabindex="6"
                     standout dense clearable
                     :error="mv$.maxTokens.$errors.length > 0"
                     :error-message="$t('required')" />
          </o-field>
        </div>
      </div>
    </q-expansion-item>

    <section class="row col-12 justify-center q-mt-md link">
      <o-link class="text-primary" :link="data.apikeyUrl">
        {{ $t('ai.providers.api.baseUrlGet', {name: data.name}) }}
      </o-link>
    </section>
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
import { notifyWarning } from 'core/utils/control'
import useForm from 'src/hooks/useForm'
import useMetadata from 'src/hooks/useMetadata'
import { getErrorMessage } from 'src/utils/request'
import useCommon from 'core/hooks/useCommon'
import { workspaceLLMService } from 'src/api/service/remote'

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
  apiKey: { required },
}
const modelRules = {
  modelType: { required },
  modelName: { required },
  maxTokens: { required },
}
const v$ = useVuelidate(rules, form)
const mv$ = useVuelidate(modelRules, form)

const models = ref<Indexable[]>([])
const modelRequired = ref(false)

function load () {
  actions.initForm(apiName)
  form.value.maxTokens = 4096
  if (props.id) {
    modelRequired.value = false
    GET({name: apiName, query: {id: props.id}}).then((data) => {
      form.value.name = data.name
      form.value.apiKey = data.credential.apiKey
      form.value.baseUrl = data.credential.baseUrl
    })
  }
  getModels()
}

function getModels() {
  const query = {
    pageSize: 1000,
    condition: {
      provider: props.data.name
    }
  }
  workspaceLLMService.query(query).then(res => {
    models.value = res.list
    modelRequired.value = res.list.length === 0
  })
}

function onSubmit () {
  errorMessage.value = ''

  // provider credential
  if (!actions.validate(v$)) {
    return
  }
  const body: Indexable = {
    id: props.id,
    name: form.value.name,
    provider: props.data.name,
    credential: {
      api_key: form.value.apiKey,
      base_url: form.value.baseUrl || props.data.baseUrl || ''
    },
  }

  // model
  if (modelRequired.value || form.value.modelName) {
    if (!actions.validate(mv$)) {
      return
    }
    body.llm = {
      modelName: form.value.modelName,
      modelType: form.value.modelType,
      modelAlias: form.value.modelAlias,
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
.volcengine-provider-config {
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

  .model {
    border: solid 1px var(--q-accent);
    border-radius: 4px;

    .q-expansion-item__content {
        padding: 1rem 0.5rem 0 0.5rem;
    }

    .q-item {
      background: var(--q-accent);
      border-radius: 4px;
    }

    &.q-expansion-item--expanded {
      border-radius: 4px 4px 0 0 !important;
      .q-item {
        border-radius: 4px 4px 0 0 !important;
      }
    }
  }
}
</style>
