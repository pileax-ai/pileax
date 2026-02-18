<template>
  <o-single-page class="page-error bg-secondary">
    <section class="row col-12 justify-center">
      <div class="col-12 text-center image">
        <img :src="$public('/images/ui/page/404.svg')" alt="404" />
      </div>
      <section class="pi-result">
        <div class="pi-result-title">
          {{ $t('auth.page.notFound') }}
        </div>
        <div class="text-readable">
          {{ $t('auth.page.notFountTips') }}
        </div>
      </section>

      <div class="row col-12 justify-center">
        <q-btn :label="$t('backToHome')" to="/" class="bg-primary text-white" flat />
      </div>
    </section>
  </o-single-page>
</template>

<script setup lang="ts">
import OSinglePage from 'core/page/template/OSinglePage.vue'
</script>

<style lang="scss">
@import "./styles";
</style>
