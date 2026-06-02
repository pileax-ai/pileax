<template>
  <q-list class="general-settings">
    <q-expansion-item icon="palette" :label="$t('appearance')"
                      header-class="header bg-accent"
                      default-opened>
      <theme-settings class="row col-12 justify-between"
                      @next="emit('next', $event)" />
    </q-expansion-item>
    <q-expansion-item icon="font_download" :label="$t('appearances.font._')"
                      header-class="header bg-accent"
                      default-opened
                      v-show="!fixedLayout">
      <font-settings class="row col-12 justify-between"
                     @next="emit('next', $event)" />
    </q-expansion-item>
    <q-expansion-item icon="format_line_spacing" :label="$t('appearances.typography._')"
                      header-class="header bg-accent"
                      default-opened v-if="!fixedLayout">
      <typography-settings class="row col-12 justify-between" />
    </q-expansion-item>
    <q-expansion-item icon="margin" :label="$t('appearances.page._')"
                      header-class="header bg-accent"
                      default-opened>
      <page-settings class="row col-12 justify-between"
                           :fixed-layout="fixedLayout" />
    </q-expansion-item>
    <q-expansion-item icon="chrome_reader_mode" :label="$t('reading.setting.pagination._')"
                      header-class="header bg-accent"
                      default-opened>
      <pagination-settings class="row col-12 justify-between"
                           :fixed-layout="fixedLayout" />
    </q-expansion-item>
  </q-list>
</template>

<script setup lang="ts">
import ThemeSettings from './theme-settings.vue'
import FontSettings from './font-settings.vue'
import TypographySettings from './typography-settings.vue'
import PageSettings from './page-settings.vue'
import PaginationSettings from './pagination-settings.vue'

defineProps({
  fixedLayout: {
    type: Boolean,
    default: false
  },
})
const emit = defineEmits(['next'])
</script>

<style lang="scss">
.general-settings {
  .o-view-item.q-link {

    .q-item__section--avatar {
      //background: green;
      //margin-left: -10px;
      //padding-left: 10px;
    }
  }

  .o-field-label {
    margin-top: 24px;

    .label {
      width: 140px;
    }

    .side {
      padding-left: 10px;
      max-width: 80%;
    }
  }
}
</style>
