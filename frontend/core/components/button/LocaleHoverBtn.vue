<template>
  <o-hover-menu-btn class="locale-hover-btn"
                    icon="translate"
                    icon-right="mdi-chevron-down"
                    anchor="bottom right"
                    self="top right"
                    menu-class="o-menu"
                    min-width="240px"
                    :label="label"
                    :round="round"
                    :offset="offset"
                    :enable-hover="enableHover" flat>
    <o-common-item v-for="(item, index) in Locales"
                   :key="index"
                   icon="public"
                   :label="item.label"
                   :class="{'active': item.value === locale}"
                   clickable closable
                   @click="onClick(item.value)">
      <div>
        <q-icon name="done" size="1rem" color="primary" v-if="item.value === locale" />
      </div>
    </o-common-item>
  </o-hover-menu-btn>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import OHoverMenuBtn from 'core/components/menu/OHoverMenuBtn.vue';
import useSetting from 'core/hooks/useSetting';
import { Locales } from 'core/constants/metadata';
import {getArrayItem} from 'core/hooks/useCommon';

const props = defineProps({
  enableHover: {
    type: Boolean,
    default: false
  },
  round: {
    type: Boolean,
    default: false
  },
  showLabel: {
    type: Boolean,
    default: false
  },
  offset: {
    type: Array,
    default: function () {
      return [0, 8]
    }
  },
});

const i18n = useI18n();
const { locale, setLocale } = useSetting();

const label = computed(() => {
  const localeLabel = getArrayItem(Locales, i18n.locale.value).label || $t('language');
  return props.showLabel ? localeLabel : '';
});

function onClick(locale :string) {
  i18n.locale.value = locale;
  setLocale(locale, false);
}
</script>

<style lang="scss">
.locale-hover-btn {
}
</style>
