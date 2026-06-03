<template>
  <setting-tab class="background-settings"
               :title="$t('appearances.background._')"
               @close="emit('close')">
    <section class="col-12 column justify-between columns">
      <header class="row col-auto justify-center">
        <q-tabs v-model="currentTab"
                active-color="white"
                active-bg-color="primary"
                indicator-color="transparent"
                content-class="pi-btn-group"
                inline-label dense>
          <template v-for="(item, index) in tabs" :key="index">
            <q-tab :name="item.value">
              {{ item.label }}
            </q-tab>
          </template>
        </q-tabs>
      </header>

      <section class="col container">
        <q-tab-panels v-model="currentTab"
                      class="bg-transparent"
                      keep-alive>
          <template v-for="(item, index) in tabs" :key="index">
            <q-tab-panel :name="item.value" class="no-padding">
              <component :is="item.component" />
            </q-tab-panel>
          </template>
        </q-tab-panels>
      </section>

      <footer class="col-auto">
        <q-list>
          <q-item-label class="text-readable text-bold">
            {{ $t('settings') }}
          </q-item-label>
          <o-field-label :label="$t('appearances.background.blur')" content-class="col-8" side>
            <q-slider v-model="backgroundBlur"
                      :min="0" :max="300" :step="1"
                      :label-value="`${backgroundBlur}`"
                      label
                      label-always
                      track-size="5px" />
          </o-field-label>
          <o-field-label :label="$t('appearances.background.opacity')" content-class="col-8" side>
            <q-slider v-model="backgroundOpacity"
                      :min="0" :max="1" :step="0.05"
                      :label-value="`${backgroundOpacity}`"
                      label
                      label-always
                      track-size="5px" />
          </o-field-label>
        </q-list>
      </footer>
    </section>
  </setting-tab>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, ref } from 'vue'
import useReaderSetting from 'src/hooks/useReaderSetting'
import useCommon from 'core/hooks/useCommon'

import OFieldLabel from 'core/components/form/field/OFieldLabel.vue'
import SettingTab from 'components/reader/settings/setting-tab.vue'
import BackgroundImages from './images.vue'
import BackgroundColors from './colors.vue'

const emit = defineEmits(['close'])

const { t } = useCommon()
const { settings, setSettingItem } = useReaderSetting()
const currentTab = ref('image')

const tabs = computed(() => {
  return [
    { label: t('image'), value: 'image', component: BackgroundImages },
    { label: t('color'), value: 'color', component: BackgroundColors },
  ]
})

const backgroundBlur = computed({
  get() {
    return settings.value.backgroundBlur
  },
  set(value: number) {
    setSettingItem('backgroundBlur', value)
  }
})
const backgroundOpacity = computed({
  get() {
    return settings.value.backgroundOpacity
  },
  set(value: number) {
    setSettingItem('backgroundOpacity', value)
  }
})

onBeforeMount(() => {
  backgroundBlur.value = settings.value.backgroundBlur || 0
})
</script>

<style lang="scss">
.background-settings {
  .columns {
    height: calc(100vh - 40px);

    header {
      height: unset !important;
      padding: 10px 0 !important;
    }

    footer {
      border-top: solid 1px var(--q-accent);
    }
  }

  .container {
    overflow-y: scroll;

    .pi-view-grid {
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)) !important;
      gap: 1rem;

      .cover-item {
        position: relative;
        width: 100%;
        height: 100%;
        cursor: pointer;

        &:hover {
          .action {
            visibility: visible;
          }
        }

        &.none {
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 12px;
          outline: solid 1px var(--q-accent);
        }

        .q-img {
          height: 100%;
          border-radius: 12px;
        }

        .action {
          position: absolute;
          top: 8px;
          right: 8px;
          z-index: 1;
          font-size: 1.4rem;
          border-radius: 50%;
          visibility: hidden;
        }

        .selected {
          visibility: visible;
        }
      }
    }
  }
}
</style>
