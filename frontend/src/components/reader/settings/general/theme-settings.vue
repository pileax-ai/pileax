<template>
  <section class="theme-settings">
    <o-field-label :label="$t('appearances.theme')"
                   content-class="row justify-around" side>
      <template v-for="(item, index) in themeList" :key="index">
        <div :class="`${itemClass}`">
          <q-btn :icon="`${item.value===theme.name ? 'done': ''}`"
                 :class="`theme-${item.value}`"
                 flat
                 @click="select(item.value)">
            <o-tooltip>
              {{$t(`appearances.themes.${item.value}`)}}
            </o-tooltip>
          </q-btn>
        </div>
      </template>
    </o-field-label>
    <o-view-item :label="$t('appearances.background._')"
                 class="col-12 q-mt-md"
                 align="right" arrow clickable
                 @click="emit('next', 'background')">
    </o-view-item>
  </section>
</template>

<script setup lang="ts">
import OFieldLabel from 'core/components/form/field/OFieldLabel.vue'

import useSetting from 'core/hooks/useSetting'
import useReaderSetting from 'src/hooks/useReaderSetting'

const props = defineProps({
  itemClass: {
    type: String,
    default: ''
  },
})
const emit = defineEmits(['next'])

const { themeList, theme, setTheme } = useSetting()
const { settings, setReaderTheme, setSettingItem } = useReaderSetting()

function select(value: string) {
  setTheme(value)
  setReaderTheme(value)
}
</script>

<style lang="scss">
.theme-settings {
  .o-field-label {
    margin-top: 0 !important;

    .label {
      width: unset!important;
    }

    .side {
      padding-left: 0 !important;
      max-width: unset!important;
    }
  }

  .q-btn {
    color: var(--q-primary);
    width: 80px;
    height: 40px;
    min-height: unset;
    padding: 0;
    margin-left: 10px;
    border-radius: 3px;

    .q-icon {
      font-size: 18px;
    }


    &:before {
      content: "";
      position: absolute;
      width: 30%;
      height: 100%;
      border-radius: 3px 0 0 3px;
    }
  }

  .theme-light {
    background: #ffffff;
    border: solid 1px rgba(0, 0, 0, 0.1);
    border-radius: 3px !important;

    &:before {
      border-right: solid 1px #ffffff;
      background: #f5f7f9;
    }
  }


  .theme-dark {
    background: #1E1F22;
    border: solid 1px rgba(255, 255, 255, 0.1);

    &:before {
      border-right: solid 1px #2B2D30;
      background: #2B2D30;
    }
  }

  .theme-darkBlue {
    background: #1A1C26;
    border: solid 1px rgba(255, 255, 255, 0.1);

    &:before {
      border-right: solid 1px #242736;
      background: #242736;
    }
  }
}
</style>
