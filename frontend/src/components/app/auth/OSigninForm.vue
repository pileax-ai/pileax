<template>
  <q-card class="o-auth-card" flat>
    <q-card-section class="header">
      <div class="label">
        {{ $t('signin') }} {{ $t('app.name') }}
      </div>
      <div class="text-tips">
        <q-icon name="rocket_launch" color="orange" />
        {{ $t('app.slogan') }}
      </div>
    </q-card-section>
    <q-card-section>
      <q-form class="o-form o-signin-form" @submit="onSubmit">
        <o-field label="邮箱">
          <q-input v-model="form.username" placeholder="邮箱"
                   outlined dense
                   :rules="[val => !!val]">
            <template #prepend>
              <q-icon name="mail_outline" />
            </template>
          </q-input>
        </o-field>
        <o-field label="密码">
          <q-input v-model="form.password" placeholder="密码"
                   :type="type"
                   autocomplete="current-password"
                   class="password"
                   outlined dense
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
        <q-checkbox v-model="remember" label="记住我" v-if="false" />

        <q-btn type="submit" :label="$t('signin')" class="bg-primary text-white col-12" flat />
      </q-form>
    </q-card-section>
    <q-card-section class="footer">
      <div class="label">
        <span class="text-tips">还没有账户？</span>
        <q-btn to="/auth/signup" flat dense>注册</q-btn>
      </div>
      <div class="label">
        <span class="text-tips">使用即代表您同意我们的</span>
        <q-btn flat dense>使用协议 & 隐私政策</q-btn>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { onBeforeMount, reactive, ref } from 'vue';
import { getItemObject, saveItemObject } from 'core/utils/storage';
import { notifyError } from 'core/utils/control';
import { useAccountStore } from 'stores/account';
import { getErrorMessage } from 'src/utils/request'

const emit = defineEmits(['success']);
const type = ref<'text' | 'password'>('password');
const remember = ref(false);
const form = reactive({
  username: '',
  password: ''
});

const accountStore = useAccountStore();

async function onSubmit () {
  try {
    const account = await accountStore.login(form);
    emit('success');

    if (remember.value) {
      saveItemObject('login-remember', {
        remember: true,
        username: form.username
      });
    }
  } catch (err) {
    const message = getErrorMessage(err);
    notifyError(message);
  }
}

onBeforeMount(() => {
  const rememberMe = getItemObject('login-remember');
  remember.value = rememberMe.remember || false;
  form.username = rememberMe.username || '';
})
</script>

<style lang="scss">
</style>
