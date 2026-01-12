<template>
  <o-simple-form-page class="workspace-member-invite"
                      :loading="loading"
                      @submit="onSubmit" enable-actions>
    <o-field :label="$t('email')" required>
      <q-input v-model="form.email" :placeholder="$t('email')"
               class="pi-field"
               standout dense clearable
               :error="v$.email.$errors.length > 0"
               :error-message="$t('label.required')">
      </q-input>
    </o-field>
    <o-field :label="$t('role')" required>
      <q-select v-model="form.role"
                class="pi-field"
                :options="WorkspaceMemberRoles.filter(item => item.value !== 'owner')"
                :error="v$.role.$errors.length > 0"
                :error-message="$t('label.required')"
                map-options
                emit-value
                standout dense />
    </o-field>

    <template #control>
      <footer class="row col-12 items-center justify-center bg-accent text-tips">
        {{ $t('workspace.invites.tips') }}
      </footer>
    </template>
  </o-simple-form-page>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'

import OSimpleFormPage from 'core/page/template/OSimpleFormPage.vue'
import { notifyWarning } from 'core/utils/control'
import useForm from 'src/hooks/useForm'
import { getErrorMessage } from 'src/utils/request'
import useMetadata from 'src/hooks/useMetadata'

const apiName = 'workspaceMember'
const props = defineProps({
  id: {
    type: String,
    default: ''
  },
})
const emit = defineEmits(['success'])

const { WorkspaceMemberRoles, } = useMetadata()
const { form, loading, actions } = useForm()

const rules = {
  email: { required },
  role: { required },
}
const v$ = useVuelidate(rules, form)

function load () {
  actions.initForm(apiName, '/invite')
}

function onSubmit () {
  if (!actions.validate(v$)) {
    return
  }
  const body = {
    ...form.value,
    id: props.id,
  }

  actions.submit(
    body,
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
.workspace-member-invite {
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
