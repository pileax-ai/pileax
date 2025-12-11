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
                @close="backgroundStatus = false;"
                v-if="backgroundStatus" />
    </transition>

    <transition appear
                enter-active-class="animated slideInRight"
                leave-active-class="animated slideOutRight">
      <font-tab class="side-fixed"
                  @close="fontStatus = false;"
                  v-if="fontStatus" />
    </transition>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import useReaderSetting from 'src/hooks/useReaderSetting'
import { changeStyle } from 'src/api/service/ebook/book'

import GeneralTab from './general/index.vue'
import KeyBindingsTab from './key-bindings/index.vue'
import FontTab from './font/index.vue'
import BackgroundTab from './background/index.vue'

const emit = defineEmits(['close'])

const { settings } = useReaderSetting()
const currentTab = ref('general')
const tabs = computed(() => {
  return [
    { label: '通用', value: 'general', icon: 'public', component: GeneralTab },
    { label: '快捷键', value: 'key-bindings', icon: 'public', component: KeyBindingsTab },
  ]
})
const fontStatus = ref(false)
const backgroundStatus = ref(false)

function onNext(value: string) {
  console.log('next', value)
  switch (value) {
    case 'background':
      backgroundStatus.value = true
      break
    case 'font':
      fontStatus.value = true
      break
  }
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
          border-bottom: solid 1px var(--q-accent);

          .q-item__label {
            font-size: 1.2rem;
          }
          .q-icon {
            font-size: 18px;
            opacity: 0.3;
          }
        }
        .q-expansion-item__content {
          padding: 10px 16px;
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
