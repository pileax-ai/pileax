<template>
  <setting-card class="general-tab">
    <o-common-card :title="$t('locales.languageTimezone')" small header padding>
      <section class="col-12">
        <q-list no-border link>
          <o-common-item size="4rem"
                         :label="$t('locales.language')"
                         :sub-label="$t('locales.languageTips')">
            <div>
              <locale-hover-btn class="text-tips bg-accent"
                                icon-right="mdi-chevron-down"
                                show-label flat />
            </div>
          </o-common-item>
          <o-common-item size="4rem"
                         :label="$t('locales.timezone')"
                         :sub-label="$t('locales.timezoneTips')">
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
import LocaleHoverBtn from 'core/components/button/LocaleHoverBtn.vue'
import SettingCard from './setting-card.vue'
</script>

<style lang="scss">
.general-tab {
}
</style>
