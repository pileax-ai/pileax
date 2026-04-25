<template>
  <section class="col-12 content-404" >
    <section class="row col-12 justify-center">
      <div class="col-12 text-center image">
        <img :src="$public('/images/ui/page/no-data.svg')" alt="404" />
      </div>
      <section class="pi-result">
        <div class="pi-result-title">
          {{ $t('auth.page.notFound') }}
        </div>
        <div class="text-readable">
          {{ $t('auth.page.notFountTips') }}
        </div>
      </section>
    </section>
  </section>
</template>

<script setup lang="ts">
</script>

<style lang="scss">
.content-404 {
  padding: 100px 0;

  .image {
    img {
      width: 100%;
      max-width: 400px;
    }
  }

  .pi-result {
    width: 400px;
    padding-bottom: 40px;
    text-align: center;

    &-title {
      font-size: 2rem;
      font-weight: 600;
    }
  }
}
</style>
