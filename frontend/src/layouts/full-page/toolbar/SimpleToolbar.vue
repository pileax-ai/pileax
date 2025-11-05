<template>
  <q-toolbar class="simple-toolbar">
    <div class="row items-center cursor-pointer app" @click="$router.push('/')">
      <q-avatar size="40px">
        <img src="/logo.svg">
      </q-avatar>
      <span class="q-ml-sm">
        {{ $t('app.name') }}
      </span>
    </div>

    <q-toolbar-title></q-toolbar-title>

    <locale-hover-btn class="bg-accent text-readable"
                      icon-right="mdi-chevron-down"
                      flat show-label />
  </q-toolbar>
</template>

<script setup lang="ts">
import LocaleHoverBtn from 'core/components/button/LocaleHoverBtn.vue'

</script>

<style lang="scss">
.simple-toolbar {

}
</style>
