<template>
  <o-single-page class="bg-accent page-error-404" content-class="bg-accent">
    <section class="row col-12 justify-center">
      <div class="col-12 text-center image">
        <img :src="$public('/images/ui/page/404.svg')" alt="404" />
      </div>
      <section class="pi-result">
        <div class="text-center pi-result-title">404</div>
        <div class="text-tips pi-result-subtitle">Sorry, the page you visited does not exist.</div>
      </section>

      <div class="row col-12 justify-center">
        <q-btn :label="$t('back.home')" to="/" class="bg-primary text-white" flat />
      </div>
    </section>
  </o-single-page>
</template>

<script setup lang="ts">
import OSinglePage from 'core/page/template/OSinglePage.vue';
</script>

<style lang="scss">
.page-error-404 {
  .o-scrollarea-page {
    padding: 48px 0;
  }

  .image {
    img {
      width: 100%;
      max-width: 400px;
    }
  }

  .pi-result {
    padding-bottom: 40px;
  }
}
</style>
