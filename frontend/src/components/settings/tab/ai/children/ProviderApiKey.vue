<template>
  <o-simple-form-page class="ai-provider"
                      :loading="loading"
                      @submit="onSubmit"
                      enable-actions>
    <o-field :label="$t('labels.name')" required>
      <q-input v-model="form.name" :placeholder="$t('labels.name')"
               class="pi-field"
               standout dense clearable
               :error="v$.name.$errors.length > 0"
               :error-message="$t('labels.required')" />
    </o-field>
    <o-field :label="$t('ai.providers.api.key')" required>
      <q-input v-model="form.apiKey" :placeholder="$t('ai.providers.api.key')"
               :type="isPwd ? 'password' : 'text'"
               class="pi-field"
               standout dense clearable
               :error="v$.apiKey.$errors.length > 0"
               :error-message="$t('labels.required')">
        <template v-slot:append>
          <q-icon
            :name="isPwd ? 'visibility_off' : 'visibility'"
            class="cursor-pointer"
            @click="isPwd = !isPwd"
          />
        </template>
      </q-input>
    </o-field>
    <o-field :label="$t('ai.providers.api.base-url')">
      <q-input v-model="form.baseUrl" :placeholder="$t('ai.providers.api.base-url-placeholder')"
               class="pi-field"
               standout dense clearable />
    </o-field>

    <section class="row col-12 justify-center link">
      <o-link class="text-primary" :link="data.apikey_url">
        {{ $t('ai.providers.api.base-url-get', {name: data.name}) }}
      </o-link>
    </section>

    <template #control>
      <footer class="row col-12 items-center justify-center bg-accent text-tips">
        {{ $t('ai.providers.api.key-tips') }}
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
import { GET } from 'src/hooks/useRequest'
import { notifyWarning } from 'core/utils/control'
import useForm from 'src/hooks/useForm'
import { getErrorMessage } from 'src/utils/request'
import useCommon from 'core/hooks/useCommon'

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

const isPwd = ref(true)
const rules = {
  name: { required },
  apiKey: { required },
}
const v$ = useVuelidate(rules, form)

function load () {
  actions.initForm(apiName)
  if (props.id) {
    GET({name: apiName, query: {id: props.id}}).then((data) => {
      form.value.name = data.name
      form.value.apiKey = data.credential.apiKey
      form.value.baseUrl = data.credential.baseUrl
    })
  }
}

function onSubmit () {
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
    }
  }

  actions.submit(
    body,
    (data) => {
      emit('success')
    },
    (err) => {
      if (err.response.status === 403) {
        notifyWarning(t('ai.providers.api.key-invalid'))
      } else {
        const message = getErrorMessage(err)
        notifyWarning(message)
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
.ai-provider {
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
