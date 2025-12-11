<template>
  <section class="theme-settings">
    <o-field-label label="主题" content-class="row justify-around" side>
      <template v-for="(item, index) in themeList" :key="index">
        <div :class="`${itemClass}`">
          <q-btn :icon="`${item.value===theme.name ? 'done': ''}`"
                 :class="`theme-${item.value}`"
                 flat
                 @click="select(item.value)">
            <o-tooltip>
              {{$t(`theme.${item.value}`)}}
            </o-tooltip>
          </q-btn>
        </div>
      </template>
    </o-field-label>
    <o-view-item label="背景" class="col-12 q-mt-md"
                 align="right" arrow clickable
                 @click="emit('next', 'background')">
    </o-view-item>
  </section>
</template>

<script setup lang="ts">
import OFieldLabel from 'core/components/form/field/OFieldLabel.vue'

const props = defineProps({
  itemClass: {
    type: String,
    default: ''
  }
})
const emit = defineEmits(['next'])

import useSetting from 'core/hooks/useSetting'
import useReaderSetting from 'src/hooks/useReaderSetting'
const { themeList, theme, setTheme } = useSetting()
const { setReaderTheme } = useReaderSetting()

function select(value: string) {
  console.log('theme', value)
  setTheme(value)
  setReaderTheme(value)
}
</script>

<style lang="scss">
.theme-settings {
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
    border: solid 1px var(--q-accent);
    border-radius: 3px !important;

    &:before {
      border-right: solid 1px #ffffff;
      background: #f5f7f9;
    }
  }


  .theme-dark {
    background: #0d1438;

    &:before {
      border-right: solid 1px rgba(#ffffff, 0.1);
      background: #0d1438;
    }
  }
}
</style>
