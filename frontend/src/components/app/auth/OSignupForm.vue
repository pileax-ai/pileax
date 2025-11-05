<template>
  <q-card class="o-auth-card" flat>
    <q-card-section class="header">
      <div class="label">
        {{ $t('signup') }} {{ $t('app.name') }}
      </div>
      <div class="text-tips">
        <q-icon name="rocket_launch" color="orange" />
        {{ $t('app.slogan') }}
      </div>
    </q-card-section>
    <q-card-section>
      <q-form class="o-form o-signin-form text-readable" @submit="onSubmit">
        <o-field label="邮箱">
          <q-input v-model="form.email" placeholder="邮箱"
                   autocomplete="email"
                   outlined dense
                   :error="v$.email.$errors.length > 0"
                   error-message="请输入正确邮箱"
                   hint="用于登录">
            <template #prepend>
              <q-icon name="mail_outline" />
            </template>
          </q-input>
        </o-field>
        <o-field label="名称">
          <q-input v-model="form.name" placeholder="名称"
                   autocomplete="name"
                   outlined dense
                   :error="v$.name.$errors.length > 0"
                   error-message="请输入名称">
            <template #prepend>
              <q-icon name="person_outline" />
            </template>
          </q-input>
        </o-field>
        <o-field label="密码">
          <q-input v-model="form.password" placeholder="密码"
                   :type="type"
                   autocomplete="new-password"
                   class="password"
                   outlined dense>
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
        <o-field label="重复密码">
          <q-input v-model="password" placeholder="重复密码"
                   :type="type"
                   class="password"
                   outlined dense>
            <template #prepend>
              <q-icon name="lock_outline" />
            </template>
            <template #append>
              <q-icon :name="type === 'password' ? 'visibility' : 'visibility_off'"
                      class="cursor-pointer"
                      @click="type = (type === 'password' ? 'text' : 'password')"
                      v-if="password" />
            </template>
          </q-input>
        </o-field>


        <q-btn type="submit" :label="$t('signup')" class="bg-primary text-white col-12" flat />
      </q-form>
    </q-card-section>
    <q-card-section class="footer">
      <div class="label">
        <span class="text-tips">已有账户？</span>
        <q-btn to="/auth/signin" flat dense>登录</q-btn>
      </div>
      <div class="label">
        <span class="text-tips">使用即代表您同意我们的</span>
        <q-btn flat dense>使用协议 & 隐私政策</q-btn>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import useVuelidate, { BaseValidation } from '@vuelidate/core'
import {maxLength, minLength, required, email} from '@vuelidate/validators';
import { notifyError } from 'core/utils/control';
import { useAccountStore } from 'stores/account';
import { Ref } from 'vue-demi'
import { getErrorMessage } from 'src/utils/request'

const emit = defineEmits(['success']);
const accountStore = useAccountStore();
const form = reactive({
  email: 'mekery@qq.com',
  name: '',
  password: '',
});
const password = ref('');
const type = ref<'text' | 'password'>('password');
const rules = {
  email: { email },
  name: { required, minLength: minLength(1), maxLength: maxLength(100) },
  password: { required },
};
const v$ = useVuelidate(rules, form);
const vuelidate: Ref<BaseValidation | null> = ref(null);

async function onSubmit() {
  vuelidate.value = v$.value;
  v$.value.$touch();
  if (v$.value.$error) {
    return;
  }

  try {
    console.log('submit', form)
    const account = await accountStore.signup(form);
    emit('success');
  } catch (err) {
    let message = getErrorMessage(err)
    if (message.includes('UNIQUE constraint')) {
      message = '邮箱已占用，请使用其它邮箱'
    }
    notifyError(message)
  }
}
</script>

<style lang="scss">

</style>
