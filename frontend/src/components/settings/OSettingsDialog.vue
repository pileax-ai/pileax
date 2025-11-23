<template>
  <q-dialog ref="modal"
            :seamless="seamless"
            @show="$emit('show')"
            @hide="onHide"
            position="standard"
            :class="`o-settings-dialog`" :maximized="isMaximized">
    <q-layout view="lhh LpR lff" container :style="style"
              class="bg-secondary">
      <q-splitter v-model="splitterModel"
                  :limits="[200, 400]"
                  unit="px"
                  class="fit">
        <template v-slot:before>
          <nav class="bg-accent navi">
            <q-tabs v-model="currentTab"
                    unix="px"
                    vertical inline-label
                    align="right"
                    active-color="primary"
                    class="text-info">
              <template v-for="(item, index) of tabs" :key="index">
                <div class="text-tips group" v-if="item.group">
                  {{item.group}}
                </div>
                <q-tab class="o-navi-tab"
                       :name="item.value"
                       :icon="item.icon"
                       :label="item.label" />
              </template>
            </q-tabs>
          </nav>
        </template>

        <template v-slot:after>
          <q-header class="bg-secondary text-info">
            <q-toolbar>
              <q-toolbar-title class="text-bold">
                {{tab?.label}}
              </q-toolbar-title>
              <q-space />
              <section class="text-tips actions no-drag-region">
                <q-btn flat round dense @click="onMinimized">
                  <o-icon :name="isMaximized ? 'icon-fluent-restore' : 'icon-fluent-maximize'" size="10px" />
                </q-btn>
                <q-btn flat round dense v-close-popup>
                  <o-icon name="icon-fluent-close" size="10px" />
                </q-btn>
              </section>
            </q-toolbar>
            <q-separator class="bg-accent" />
          </q-header>
          <q-page-container>
            <q-page class="bg-secondary">
              <q-scroll-area class="o-scroll-wrapper">
                <q-tab-panels v-model="currentTab" class="fit col-12" vertical keep-alive>
                  <template v-for="(item, index) of tabs" :key="index">
                    <q-tab-panel :name="item.value">
                      <component :is="item.component" />
                    </q-tab-panel>
                  </template>
                </q-tab-panels>
              </q-scroll-area>
            </q-page>
          </q-page-container>
        </template>
      </q-splitter>
    </q-layout>
  </q-dialog>
</template>

<script setup lang="ts">
import {computed, onMounted, ref, watch} from 'vue';
import useDialog from 'core/hooks/useDialog';
import useCommon from 'core/hooks/useCommon';

import AboutTab from 'src/components/settings/tab/about-tab.vue';
import AiTab from 'components/settings/tab/ai-tab.vue';
import AppearanceTab from 'src/components/settings/tab/appearance-tab.vue';
import GeneralTab from 'src/components/settings/tab/general-tab.vue';
import ProfileTab from 'src/components/settings/tab/profile-tab.vue';
import ReadingTab from 'src/components/settings/tab/reading-tab.vue';

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  seamless: {
    type: Boolean,
    default: false
  },
  scrollable: {
    type: Boolean,
    default: false
  },
});
const emit = defineEmits(['show']);

const { dialog, onHide } = useDialog();
const { t } = useCommon();
const modal = ref();
const splitterModel = ref(300);
const currentTab = ref('profile');
const isMaximized = ref(false);
const style = computed(() => {
  return isMaximized.value
    ? {
      height: '100vh',
      width: '100vw',
    }
    : {
      height: '90vh',
      maxHeight: '90vh',
      width: '90vw',
      maxWidth: '90vw',
    }
})

const tabs = computed(() => {
  return [
    { label: '个人资料', value: 'profile', icon: 'person', group: '账户', component: ProfileTab },
    { label: '通用', value: 'general', icon: 'settings', group: '设置', component: GeneralTab },
    { label: '外观', value: 'appearance', icon: 'palette', component: AppearanceTab },
    { label: '阅读', value: 'reading', icon: 'chrome_reader_mode', component: ReadingTab },
    { label: 'AI模型提供商', value: 'ai', icon: 'mdi-creation', group: 'AI', component: AiTab },
    { label: t('about'), value: 'about', icon: 'info', group: t('about'), component: AboutTab },
    { label: '隐私政策', value: 'about', icon: 'policy', component: AboutTab },
  ];
});

const tab = computed(() => {
  return tabs.value.find(t => t.value === currentTab.value);
})

const type = computed(() => dialog.value.type);

function onMinimized() {
  isMaximized.value = !isMaximized.value;
}

watch(() => type.value, (newValue) => {
  if (newValue === 'settings') {
    modal.value.show();
  } else {
    modal.value.hide();
  }
})

onMounted(() => {
  if (type.value === 'settings') {
    modal.value.show();
    currentTab.value = dialog.value.tab || 'profile';
  }
})
</script>

<style lang="scss">
.o-settings-dialog {
  .q-splitter__before {
    height: 100%;
  }

  .q-splitter__separator {
    background-color: transparent !important;
  }

  nav {
    height: 90vh;
    padding: 40px 10px 16px 10px;
    .group {
      padding: 0 12px;
      opacity: 0.5;
      &:not(:first-child) {
        margin-top: 16px;
      }
    }
    .q-tab {
      padding: 0 8px;
      margin-bottom: 2px;
      min-height: 36px;
      border-radius: 4px;

      &__label {
        font-weight: 400;
      }

      &.q-tab--active {

        &:before {
          border-radius: 4px;
        }
      }

      &.q-tab--active .q-tab__indicator {
        top: 10px !important;
        height: 20px !important;
        display: none;
      }
    }
  }

  .q-tab-panel {
    .q-btn {
      //min-width: 100px;
    }
  }

  .q-toolbar {
    min-height: 52px;

    .q-toolbar__title {
      font-size: 1.2rem;
      padding-left: 16px;
    }

    .q-icon {
      font-size: 1.2rem;
    }

    .actions {
      .q-btn {
        border-radius: 4px !important;
      }
    }
  }

  .q-dialog__inner--maximized {
    nav {
      height: 100vh;
    }
  }
}
</style>
