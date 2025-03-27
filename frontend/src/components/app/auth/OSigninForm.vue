<template>
  <q-card class="o-signin-card" flat>
    <q-card-section class="header">
      {{ $t('signin') }}
    </q-card-section>
    <q-card-section>
      <q-form class="o-form o-signin-form" @submit="handleLogin">
        <q-input v-model="form.phone" label="用户名" class="o-field" standout
                 :rules="[val => !!val]">
          <template #prepend>
            <q-icon name="person_outline" />
          </template>
        </q-input>
        <q-input v-model="form.password" label="密码" :type="type" class="o-field password" standout
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
        <q-checkbox v-model="remember" label="记住我" />

        <q-btn type="submit" :label="$t('signin')" class="bg-primary text-white col-12" flat />
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import {onBeforeMount, onMounted, ref} from 'vue';
import { useAccountStore } from 'stores/account';
import { getItemObject, saveItemObject } from 'core/utils/storage';
import { notifyError } from 'core/utils/control';

const emit = defineEmits(['success']);
const type = ref('password');
const remember = ref(false);
const form = ref({
  phone: '',
  password: ''
});

const accountStore = useAccountStore();

async function handleLogin () {
  try {
    const account = await accountStore.login(form.value);
    emit('success');

    if (remember.value) {
      saveItemObject('login-remember', {
        remember: true,
        phone: form.value.phone
      });
    }
  } catch (err) {
    notifyError(err.message)
  }
}

onBeforeMount(() => {
  const rememberMe = getItemObject('login-remember');
  remember.value = rememberMe.remember || false;
  form.value.phone = rememberMe.phone || '';
})
</script>

<style lang="scss">
.o-signin-card {
  width: 100%;
  padding: 1rem 2rem;
  background: transparent;

  .header {
    font-size: 2rem;
    font-weight: 600;
  }

  .o-form {
    .password {
      margin-bottom: 4px !important;
    }

    .q-field__control {
      padding: 0 16px;
    }

    .q-field__control, .q-field__prepend, .q-field__append {
      border-radius: 4px;
    }
    .q-field--focused, .q-field--highlighted {
      .q-field__control {
        background: rgba(#000, 0.05) !important;
        box-shadow: unset !important;
        box-sizing: border-box !important;

        input, .q-field__native {
          color: #000;
        }
        .q-field__prefix, .q-field__suffix, .q-field__marginal {
          color: #666;
        }
      }
    }

    .q-btn {
      width: 100%;
      min-height: 56px;
      border-radius: 4px;

      margin-top: 50px;
    }
  }
}
</style>
