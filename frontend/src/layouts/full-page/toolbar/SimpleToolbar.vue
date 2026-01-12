<template>
  <q-toolbar class="simple-toolbar drag-region">
    <div class="row items-center cursor-pointer app" @click="$router.push('/')">
      <q-avatar size="40px">
        <img :src="$public('/logo.svg')">
      </q-avatar>
      <span class="q-ml-sm">
        {{ $t('product.name') }}
      </span>
    </div>

    <q-toolbar-title></q-toolbar-title>

    <q-btn :icon="darkMode ? 'light_mode' : 'dark_mode'"
           class="bg-accent text-readable q-mr-sm"
           style="width: 36px;"
           flat
           @click="toggleTheme" />
    <locale-hover-btn class="bg-accent text-readable no-drag-region"
                      icon-right="mdi-chevron-down"
                      flat show-label />
    <o-tool-bar-overlay class="col-auto" />
  </q-toolbar>
</template>

<script setup lang="ts">
import LocaleHoverBtn from 'core/components/button/LocaleHoverBtn.vue'
import OToolBarOverlay from 'core/components/electron/OToolBarOverlay.vue'
import useSetting from 'core/hooks/useSetting'

const { darkMode, toggleTheme } = useSetting()
</script>

<style lang="scss">
.simple-toolbar {
  background: var(--q-secondary);
}
</style>
