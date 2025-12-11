<template>
  <q-list>
    <q-expansion-item label="外观" header-class="header" default-opened>
      <theme-settings class="row col-12 justify-between"
                      @next="emit('next', $event)" />
    </q-expansion-item>
    <q-expansion-item label="字体" header-class="header" default-opened>
      <font-settings class="row col-12 justify-between"
                     @next="emit('next', $event)" />
    </q-expansion-item>
    <q-expansion-item label="排版" header-class="header" default-opened>
      <typography-settings class="row col-12 justify-between" />
    </q-expansion-item>
    <q-expansion-item label="其它" header-class="header" default-opened>
      <other-settings class="row col-12 justify-between" />
    </q-expansion-item>
  </q-list>
</template>

<script setup lang="ts">
import FontSettings from './font-settings.vue'
import TypographySettings from './typography-settings.vue'
import ThemeSettings from './theme-settings.vue'
import OtherSettings from './other-settings.vue'

const emit = defineEmits(['next'])
</script>

<style lang="scss">

</style>
