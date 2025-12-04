<template>
  <setting-card class="general-tab">
    <o-common-card title="语言 & 时间" small header padding>
      <section class="col-12">
        <q-list no-border link>
          <o-common-item size="4rem"
                         :label="$t('language')"
                         sublabel="Change the language used in user interface">
            <div>
              <locale-hover-btn class="text-tips bg-accent"
                                icon-right="mdi-chevron-down"
                                show-label flat />
            </div>
          </o-common-item>
          <o-common-item size="4rem"
                         label="Timezone"
                         sublabel="Current timezone setting.">
            <div>
              <locale-hover-btn class="text-tips bg-accent"
                                icon-right="mdi-chevron-down"
                                show-label flat />
            </div>
          </o-common-item>
        </q-list>
      </section>
    </o-common-card>
  </setting-card>
</template>

<script setup lang="ts">
import LocaleHoverBtn from 'core/components/button/LocaleHoverBtn.vue';
import SettingCard from './setting-card.vue';
</script>

<style lang="scss">
.general-tab {
}
</style>
