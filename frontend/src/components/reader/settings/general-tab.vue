<template>
  <q-list>
    <q-expansion-item label="外观" default-opened>
      <theme-settings class="row col-12 justify-between" />
    </q-expansion-item>
    <q-expansion-item label="字体" default-opened>
      <font-settings class="row col-12 justify-between" />
    </q-expansion-item>
    <q-expansion-item label="排版" default-opened>
      <typography-settings class="row col-12 justify-between" />
    </q-expansion-item>
    <q-expansion-item label="其它" default-opened>
      <other-settings class="row col-12 justify-between" />
    </q-expansion-item>
  </q-list>
</template>

<script setup lang="ts">
import FontSettings from 'components/reader/settings/font-settings.vue'
import TypographySettings from 'components/reader/settings/typography-settings.vue'
import ThemeSettings from 'components/reader/settings/theme-settings.vue'
import OtherSettings from 'components/reader/settings/other-settings.vue'
</script>

<style lang="scss">

</style>
