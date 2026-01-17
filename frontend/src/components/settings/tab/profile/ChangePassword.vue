<template>
  <o-simple-form-page class="ai-provider"
                      :loading="loading"
                      @submit="onSubmit"
                      enable-actions>
    <o-field :label="$t('auth.account.security.password')" required>
      <q-input v-model="form.password"
               type="password"
               tabindex="1"
               :placeholder="$t('auth.account.security.password')"
               class="pi-field"
               standout dense clearable
               :error="v$.password.$errors.length > 0"
               :error-message="$t('required')">
      </q-input>
    </o-field>
    <o-field :label="$t('auth.account.security.password_new')" required>
      <q-input v-model="form.newPassword"
               type="password"
               tabindex="2"
               :placeholder="$t('auth.account.security.password_new')"
               class="pi-field"
               standout dense clearable
               :error="v$.newPassword.$errors.length > 0"
               :error-message="$t('required')">
      </q-input>
    </o-field>
    <o-field :label="$t('auth.signup.confirmPassword')">
      <q-input v-model="form.confirmPassword"
               type="password"
               tabindex="3"
               :placeholder="$t('auth.signup.confirmPassword')"
               class="pi-field"
               standout dense clearable
               :error="v$.confirmPassword.$errors.length > 0"
               :error-message="$t('auth.signup.confirmPasswordError')">
      </q-input>
    </o-field>

    <template #control>
      <footer class="row col-12 items-center justify-center bg-accent text-tips">
        Share workspaces.
      </footer>
    </template>
  </o-simple-form-page>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'
import useVuelidate from '@vuelidate/core'
import { required, sameAs } from '@vuelidate/validators'

import OSimpleFormPage from 'core/page/template/OSimpleFormPage.vue'
import { notifyWarning } from 'core/utils/control'
import useForm from 'src/hooks/useForm'
import { getErrorMessage } from 'src/utils/request'
import { accountSecurityService } from 'src/api/service/remote/account-security'
import useCommon from 'core/hooks/useCommon'

const emit = defineEmits(['success'])

const { t } = useCommon()
const { loading, actions } = useForm()
const form = reactive({
  password: '',
  newPassword: '',
  confirmPassword: ''
})

const passwordRef = computed(() => form.newPassword)
const rules = {
  password: { required },
  newPassword: { required },
  confirmPassword: { sameAsPassword: sameAs(passwordRef) }
}
const v$ = useVuelidate(rules, form)

function onSubmit () {
  if (!actions.validate(v$)) {
    return
  }
  const body = {
    password: form.password,
    newPassword: form.newPassword
  }

  accountSecurityService.changePassword(body).then(() => {
    emit('success')
  }).catch((err) => {
    const message = getErrorMessage(err)
    notifyWarning(t(message))
  })
}

</script>

<style lang="scss">
</style>
