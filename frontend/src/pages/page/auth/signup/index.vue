<template>
  <q-page class="page-auth signup column">
    <section class="row col items-center justify-center">
      <section class="auth-form-wrapper">
        <o-signup-form @success="onSuccess" />
      </section>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import LocaleHoverBtn from 'core/components/button/LocaleHoverBtn.vue';
import OSignupForm from 'components/app/auth/OSignupForm.vue';

import useAccount from 'src/hooks/useAccount';

const { account, isLogin } = useAccount();
const showSignIn = ref(true);

function onSuccess() {
  showSignIn.value = false;
}
</script>

<style lang="scss">
@import "../auth";
</style>
