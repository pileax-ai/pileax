<template>
  <section class="reader-settings bg-secondary no-drag-region">
    <header class="row col-12 justify-center items-center">
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

      <section class="close text-tips">
        <q-btn icon="close" class="o-toolbar-btn" flat @click="emit('close')" />
      </section>
    </header>
    <q-scroll-area class="o-scroll-wrapper">
      <q-tab-panels v-model="currentTab"
                    class="bg-transparent"
                    keep-alive>
        <template v-for="(item, index) in tabs" :key="index">
          <q-tab-panel :name="item.value" class="no-padding">
            <component :is="item.component" @next="onNext" />
          </q-tab-panel>
        </template>
      </q-tab-panels>
    </q-scroll-area>

    <transition appear
                enter-active-class="animated slideInRight"
                leave-active-class="animated slideOutRight">
      <background-tab class="side-fixed"
                @close="onNext('background', false)"
                v-if="next['background']" />
    </transition>

    <transition appear
                enter-active-class="animated slideInRight"
                leave-active-class="animated slideOutRight">
      <font-tab class="side-fixed"
                  @close="onNext('font', false)"
                  v-if="next['font']" />
    </transition>
  </section>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import useReaderSetting from 'src/hooks/useReaderSetting'
import { changeStyle } from 'src/api/service/ebook/book'

import GeneralTab from './general/index.vue'
import KeyBindingsTab from './key-bindings/index.vue'
import FontTab from './font/index.vue'
import BackgroundTab from './background/index.vue'
import useCommon from 'core/hooks/useCommon'

const emit = defineEmits(['close'])

const { t } = useCommon()
const { settings } = useReaderSetting()
const currentTab = ref('general')
const tabs = computed(() => {
  return [
    { label: t('general'), value: 'general', icon: 'public', component: GeneralTab },
    { label: t('systems.shortcut'), value: 'key-bindings', icon: 'public', component: KeyBindingsTab },
  ]
})
const next = reactive<Indexable>({
  background: false,
  font: false,
})

function onNext(name: string, value = true) {
  next[name] = value
}

watch(
  () => settings.value,
  (newValue) => {
    // console.log('settings', newValue);
    changeStyle(newValue)
  },
  { deep: true }
)
</script>

<style lang="scss">
.reader-settings {
  header {
    border-bottom: solid 1px var(--q-accent);

    .pi-btn-group {
      .q-btn {
        min-width: 60px;
        padding: 0 10px;
      }
      .q-tab {
        height: 28px;
        min-height: unset;
      }
    }

    .close {
      position: absolute;
      right: 10px;
    }
  }

  .o-scroll-wrapper {
    .q-list {
      padding: 0 1rem;

      .q-expansion-item {
        border: solid 1px var(--q-dark);
        border-radius: 8px;
        margin-top: 1rem;

        .header {
          border-radius: 8px 8px 0 0;
          font-weight: bold;
          .q-item__label {
            font-size: 1.2rem;
          }
          .q-icon {
            font-size: 18px;
            opacity: 0.3;
          }
        }

        .q-expansion-item__content {
          padding: 10px 8px;
          border-top: solid 1px var(--q-accent);

          .o-field-label {
            padding: 0 8px;
          }
          .o-view-item {
            padding-left: 8px;
            padding-right: 4px;

            .q-item__section--side {
              padding-left: 0;
            }
          }
        }


        .o-common-item {
          min-height: unset;
          .q-btn {
            min-width: 64px;
            min-height: unset;
            padding: 2px 8px;
          }
        }

        .o-view-item {
          .q-item__section--side .q-icon {
            font-size: 1.2rem;
            opacity: 0.5;
          }
        }

        .main-label {
          font-size: 1rem;
          font-weight: normal;
        }
      }
    }
  }


}
</style>
