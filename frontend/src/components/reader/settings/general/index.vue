<template>
  <q-list class="general-settings">
    <q-expansion-item :label="$t('appearance')" header-class="header" default-opened>
      <theme-settings class="row col-12 justify-between"
                      @next="emit('next', $event)" />
    </q-expansion-item>
    <q-expansion-item :label="$t('appearances.font._')" header-class="header" default-opened>
      <font-settings class="row col-12 justify-between"
                     @next="emit('next', $event)" />
    </q-expansion-item>
    <q-expansion-item :label="$t('appearances.typography._')" header-class="header" default-opened>
      <typography-settings class="row col-12 justify-between" />
    </q-expansion-item>
    <q-expansion-item :label="$t('more')" header-class="header" default-opened>
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
.general-settings {
  .o-view-item.q-link {
    //background: red;

    .q-item__section--avatar {
      //background: green;
      //margin-left: -10px;
      //padding-left: 10px;
    }
  }
}
</style>
