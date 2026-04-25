<template>
  <q-toolbar class="o-simple-toolbar drag-region">
    <div class="row items-center cursor-pointer app no-drag-region"
         @click="$router.push('/')" v-if="showLogo">
      <q-avatar size="40px">
        <img :src="$public('/logo.svg')">
      </q-avatar>
      <span class="q-ml-sm">
        {{ $t('product.name') }}
      </span>
    </div>
    <slot name="left"></slot>

    <q-toolbar-title></q-toolbar-title>


    <div class="row items-center o-toolbar-extra no-drag-region">
      <q-btn :icon="darkMode ? 'light_mode' : 'dark_mode'"
             class="bg-accent text-readable q-mr-sm desktop-only"
             style="width: 36px;"
             flat
             @click="toggleTheme" />
      <locale-hover-btn class="bg-accent text-readable no-drag-region desktop-only"
                        icon-right="mdi-chevron-down"
                        flat show-label />
      <slot name="right"></slot>
    </div>
    <o-tool-bar-overlay class="col-auto" />
  </q-toolbar>
</template>

<script setup lang="ts">
import LocaleHoverBtn from 'core/components/button/LocaleHoverBtn.vue'
import OToolBarOverlay from 'core/components/electron/OToolBarOverlay.vue'
import useSetting from 'core/hooks/useSetting'

const props = defineProps({
  showLogo: {
    type: Boolean,
    default: false
  }
})

const { darkMode, toggleTheme } = useSetting()
</script>

<style lang="scss">
.o-simple-toolbar {
}
</style>
