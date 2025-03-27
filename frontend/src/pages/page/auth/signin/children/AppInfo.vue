<template>
  <section class="app-info">
    <header class="app">
      <div class="row items-center app-title">
        <img src="/logo.png" alt="Logo" class="logo" />
        <div class="q-ml-md name">
          {{$t('app.name')}}
          <q-badge align="middle">AI</q-badge>
        </div>
      </div>
      <div class="app-desc desktop-only">
        {{$t('app.slogan')}}
      </div>
    </header>

    <slot></slot>
  </section>
</template>

<script setup lang="ts">
</script>

<style lang="scss">
.app-info {
  .app {
    padding-top: 80px;
    padding-left: 80px;
    text-align: left;
    color: #ffffff;
    font-family: 'Segoe UI', 'Helvetica Neue', 'Helvetica', Arial, sans-serif;

    .app-title {
      font-size: 60px;
      font-weight: 200;

      img {
        width: 56px;
        height: 56px;
      }
    }

    .app-desc {
      padding-top: 60px;
      font-size: 30px;
      font-weight: 300;
      opacity: 0.7;
    }

    .app-features {
      margin-top: 40px;
      font-size: 20px;
      font-weight: 200;
      opacity: 0.6;
    }
  }
}
</style>
