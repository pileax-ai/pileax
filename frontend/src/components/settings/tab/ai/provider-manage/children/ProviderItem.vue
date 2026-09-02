<template>
  <o-simple-form-page class="provider-form"
                      :loading="loading"
                      @submit="onSubmit"
                      enable-actions>
    <div class="row col-12 justify-center items-center q-py-md">
      <o-svg-icon :name="data.logo" size="100px" colored />
    </div>

    <o-field :label="$t('name')" required>
      <q-input v-model="form.label" :placeholder="$t('name')"
               class="pi-field"
               standout dense clearable
               :error="v$.label.$errors.length > 0"
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
import { getErrorMessage } from 'src/utils/request'

const apiName = 'llmProvider'
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

const { form, loading, actions } = useForm()
const status = ref(true)
const rules = {
  label: { required },
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
    label: form.value.label,
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
.provider-form {
}
</style>
