<template>
  <q-page class="page-auth signin column">
    <section class="row col items-center justify-center">
      <section class="auth-form-wrapper">
        <o-signin-form @success="onSuccess" />
      </section>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { router } from 'src/router'

import useAccount from 'src/hooks/useAccount'

import OSigninForm from 'components/app/auth/OSigninForm.vue'

const showSignIn = ref(true)

const { account, isLogin } = useAccount()


function onSuccess() {
  showSignIn.value = false
}
</script>

<style lang="scss">
@import "../auth";
</style>
