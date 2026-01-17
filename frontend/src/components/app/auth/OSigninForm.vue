<template>
  <q-card class="o-auth-card" flat>
    <q-card-section class="header">
      <div class="label">
        {{ $t('signin') }} {{ $t('product.name') }}
      </div>
      <div class="text-tips">
        <q-icon name="rocket_launch" color="orange" />
        {{ $t('product.slogan') }}
      </div>
    </q-card-section>
    <q-card-section>
      <q-form class="o-form o-signin-form" @submit="onSubmit">
        <o-field :label="$t('email')">
          <q-input v-model="form.username"
                   :placeholder="$t('email')"
                   tabindex="1"
                   outlined dense clearable
                   :rules="[val => !!val]">
            <template #prepend>
              <q-icon name="mail_outline" />
            </template>
          </q-input>
        </o-field>
        <o-field :label="$t('password')">
          <q-input v-model="form.password"
                   :placeholder="$t('password')"
                   :type="type"
                   tabindex="2"
                   autocomplete="current-password"
                   class="password"
                   outlined dense clearable
                   :rules="[val => !!val]">
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
        <q-checkbox v-model="remember"
                    :label="$t('auth.rememberMe')"
                    style="margin-top: -12px;" />

        <q-btn type="submit" :label="$t('signin')" class="bg-primary text-white col-12" flat />
      </q-form>
    </q-card-section>
    <q-card-section class="footer">
      <div class="label">
        <span class="text-tips">{{ $t('auth.accountNo') }}</span>
        <q-btn to="/auth/signup" flat dense>{{ $t('signup') }}</q-btn>
      </div>
      <div class="row label">
        <span class="text-tips">{{ $t('auth.useToConsent') }}</span>
        <q-btn flat dense>{{ $t('terms.service') }} & {{ $t('terms.privacy') }}</q-btn>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { onBeforeMount, reactive, ref } from 'vue'
import { getItemObject, saveItemObject } from 'core/utils/storage'
import { notifyError } from 'core/utils/control'
import { useAccountStore } from 'stores/account'
import { getErrorMessage } from 'src/utils/request'
import useCommon from 'core/hooks/useCommon'

const emit = defineEmits(['success'])
const type = ref<'text' | 'password'>('password')
const remember = ref(false)
const form = reactive({
  username: '',
  password: ''
})

const { t } = useCommon()
const accountStore = useAccountStore()

async function onSubmit () {
  try {
    const account = await accountStore.login(form)
    emit('success')

    if (remember.value) {
      saveItemObject('login-remember', {
        remember: true,
        username: form.username
      })
    }
  } catch (err) {
    const message = getErrorMessage(err)
    notifyError(t(message))
  }
}

onBeforeMount(() => {
  const rememberMe = getItemObject('login-remember')
  remember.value = rememberMe.remember || false
  form.username = rememberMe.username || ''
})
</script>

<style lang="scss">
</style>
