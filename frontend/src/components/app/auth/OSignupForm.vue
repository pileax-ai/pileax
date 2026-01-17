<template>
  <q-card class="o-auth-card" flat>
    <q-card-section class="header">
      <div class="label">
        {{ $t('signup') }} {{ $t('product.name') }}
      </div>
      <div class="text-tips">
        <q-icon name="rocket_launch" color="orange" />
        {{ $t('product.slogan') }}
      </div>
    </q-card-section>
    <q-card-section>
      <q-form class="o-form o-signin-form text-readable" @submit="onSubmit">
        <o-field :label="$t('email')">
          <q-input v-model="form.email"
                   :placeholder="$t('email')"
                   autocomplete="email"
                   tabindex="1"
                   outlined dense
                   :error="v$.email.$errors.length > 0"
                   :error-message="$t('auth.signup.emailError')"
                   :hint="$t('auth.signup.emailHint')">
            <template #prepend>
              <q-icon name="mail_outline" />
            </template>
          </q-input>
        </o-field>
        <o-field :label="$t('name')">
          <q-input v-model="form.name" :placeholder="$t('name')"
                   autocomplete="name"
                   tabindex="2"
                   outlined dense
                   :error="v$.name.$errors.length > 0"
                   :error-message="$t('auth.signup.nameError')">
            <template #prepend>
              <q-icon name="person_outline" />
            </template>
          </q-input>
        </o-field>
        <o-field :label="$t('password')">
          <q-input v-model="form.password" :placeholder="$t('password')"
                   :type="type"
                   autocomplete="new-password"
                   tabindex="3"
                   class="password"
                   outlined dense
                   :error="v$.password.$errors.length > 0"
                   :error-message="$t('auth.signup.passwordError')">
            <template #prepend>
              <q-icon name="lock_outline" />
            </template>
            <template #append>
              <q-icon :name="type === 'password' ? 'visibility' : 'visibility_off'"
                      class="cursor-pointer"
                      @click="type = (type === 'password' ? 'text' : 'password')"
                      v-if="form.password" />
            </template>
          </q-input>
        </o-field>
        <o-field :label="$t('auth.signup.confirmPassword')">
          <q-input v-model="form.confirmPassword"
                   :placeholder="$t('auth.signup.confirmPassword')"
                   :type="type"
                   tabindex="4"
                   class="password"
                   outlined dense
                   :error="v$.confirmPassword.$errors.length > 0"
                   :error-message="$t('auth.signup.confirmPasswordError')">
            <template #prepend>
              <q-icon name="lock_outline" />
            </template>
            <template #append>
              <q-icon :name="type === 'password' ? 'visibility' : 'visibility_off'"
                      class="cursor-pointer"
                      @click="type = (type === 'password' ? 'text' : 'password')"
                      v-if="form.confirmPassword" />
            </template>
          </q-input>
        </o-field>

        <q-btn type="submit" :label="$t('signup')" class="bg-primary text-white col-12" flat />
      </q-form>
    </q-card-section>
    <q-card-section class="footer">
      <div class="label">
        <span class="text-tips">{{ $t('auth.accountAlready') }}</span>
        <q-btn to="/auth/signin" flat dense>{{ $t('signin') }}</q-btn>
      </div>
      <div class="label">
        <span class="text-tips">{{ $t('auth.useToConsent') }}</span>
        <q-btn flat dense>{{ $t('terms.service') }} & {{ $t('terms.privacy') }}</q-btn>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import type { BaseValidation } from '@vuelidate/core'
import useVuelidate from '@vuelidate/core'
import {maxLength, minLength, required, email, sameAs} from '@vuelidate/validators'
import { notifyError } from 'core/utils/control'
import { useAccountStore } from 'stores/account'
import type { Ref } from 'vue-demi'
import { getErrorMessage } from 'src/utils/request'
import useCommon from 'core/hooks/useCommon'

const emit = defineEmits(['success'])

const { t } = useCommon()
const accountStore = useAccountStore()
const form = reactive({
  email: '',
  name: '',
  password: '',
  confirmPassword: ''
})
const passwordRef = computed(() => form.password)
const type = ref<'text' | 'password'>('password')
const rules = {
  email: { required, email },
  name: { required, minLength: minLength(1), maxLength: maxLength(100) },
  password: { required },
  confirmPassword: { sameAsPassword: sameAs(passwordRef) }
}
const v$ = useVuelidate(rules, form)
const vuelidate: Ref<BaseValidation | null> = ref(null)

async function onSubmit() {
  vuelidate.value = v$.value
  v$.value.$touch()
  if (v$.value.$error) {
    console.log('submit', v$.value)
    return
  }

  try {
    const account = await accountStore.signup({
      email: form.email,
      name: form.name,
      password: form.password
    })
    emit('success', account)
  } catch (err) {
    let message = getErrorMessage(err)
    if (message.includes('UNIQUE constraint')) {
      message = t('auth.signup.emailUsed')
    }
    notifyError(message)
  }
}
</script>

<style lang="scss">

</style>
