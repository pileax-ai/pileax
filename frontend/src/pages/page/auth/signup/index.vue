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
import { ref } from 'vue'

import OSignupForm from 'components/app/auth/OSignupForm.vue'

const showSignIn = ref(true)

function onSuccess() {
  showSignIn.value = false
}
</script>

<style lang="scss">
@import "../auth";
</style>
