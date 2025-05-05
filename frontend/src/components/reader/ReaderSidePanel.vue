<template>
  <section class="reader-side-panel" :class="{'main': main}">
    <o-tool-bar>
    </o-tool-bar>
    <header class="row col-12 justify-between items-center text-readable toolbar">
      <section class="col row items-center">
        <q-tabs v-model="currentTab"
                active-color="primary"
                indicator-color="transparent"
                dense
                narrow-indicator
                shrink>
          <template v-for="(item, index) in tabs" :key="index">
            <q-tab :name="index">
              <o-icon :name="item.icon" size="20px" class="rounded-borders" />
              <o-tooltip :message="item.label" />
            </q-tab>
          </template>
        </q-tabs>
      </section>

      <section class="col-auto">
        <q-btn icon="settings" class="o-toolbar-btn" flat
               @click="toggleSettings" v-if="main">
          <o-tooltip>阅读设置</o-tooltip>
        </q-btn>
        <q-btn icon="more_horiz" class="o-toolbar-btn" flat>
          <q-menu class="pi-menu">
            <q-list :style="{minWidth: '200px'}">
              <template v-for="(action, index) in actions" :key="`action-${index}`">
                <template v-if="action.show">
                  <q-separator class="bg-accent" v-if="action.separator" />
                  <o-common-item v-bind="action"
                                 class="text-tips"
                                 :class="{ 'active': action.selected }"
                                 @click="onAction(action)"
                                 clickable closable right-side>
                    <template #side>
                      <q-icon name="check" size="14px" v-if="action.selected" />
                    </template>
                  </o-common-item>
                </template>
              </template>
            </q-list>
          </q-menu>
        </q-btn>
      </section>
    </header>
    <q-scroll-area class="o-scroll-wrapper">
      <q-tab-panels v-model="currentTab"
                    class="o-page-container bg-transparent"
                    keep-alive>
        <template v-for="(item, index) in components" :key="index">
          <q-tab-panel :name="index">
            <component :is="item.component" :item="item.item" />
          </q-tab-panel>
        </template>
      </q-tab-panels>
    </q-scroll-area>

    <transition appear
                enter-active-class="animated slideInRight"
                leave-active-class="animated slideOutRight">
      <ai-agent-manager class="side-fixed"
                        :main="main"
                        @close="showAiAgent(false)"
                        v-if="addAiAgentStatus" />
    </transition>

    <transition appear
                enter-active-class="animated slideInRight"
                leave-active-class="animated slideOutRight">
      <web-service-manager class="side-fixed"
                           :main="main"
                           @close="showAddService(false)"
                           @add="onAddService"
                           @remove="onRemoveService"
                           v-if="addServiceStatus" />
    </transition>

    <transition appear
                enter-active-class="animated slideInRight"
                leave-active-class="animated slideOutRight">
      <reader-settings class="side-fixed"
                       @close="toggleSettings"
                       v-if="settingsStatus && main" />
    </transition>

    <transition appear
                enter-active-class="animated slideInRight"
                leave-active-class="animated slideOutRight">
      <tts-player class="side-fixed"
                  @close="ttsStatus = false;"
                  v-if="ttsStatus && main" />
    </transition>
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, ref, watch } from 'vue';
import useReader from 'src/hooks/useReader';
import ReaderSide from 'src/components/reader/ReaderSide.vue';
import AiAgentManager from 'components/reader/agent/ai-agent-manager.vue';
import WebServiceManager from 'components/reader/service/web-service-manager.vue';
import ReaderSettings from 'src/components/reader/settings/index.vue';
import TtsPlayer from 'src/components/reader/tts/tts-player.vue';
import OToolBar from 'core/components/electron/OToolBar.vue';

const props = defineProps({
  main: {
    type: Boolean,
    default: false
  }
});

const {
  mainService,
  secondaryService,
  rightDrawer,
  rightDrawerShow,
  setRightDrawerHoverShow,
  setRightDrawerSplit,
  setRightDrawerTTS,
  toggleRightDrawer
} = useReader();

const currentTab = ref(0);
const addAiAgentStatus = ref(false);
const addServiceStatus = ref(false);
const settingsStatus = ref(false);
const ttsStatus = computed({
  get() {
    return rightDrawer.value.tts;
  },
  set(val: boolean) {
    setRightDrawerTTS(val);
  }
});

const defaultTab = computed(() => {
  return { label: 'AI', value: 'chat', type: 'ai', icon: 'mdi-creation' };
});
const tabs = computed(() => {
  return props.main
    ? [
      defaultTab.value,
      ...mainService.value
    ]
    : [
      defaultTab.value,
      ...secondaryService.value
    ];
})

const components = computed(() => {
  return tabs.value.map((item) => {
    return {
      value: item.value,
      component: ReaderSide,
      item: item
    };
  });
});
const showTTS = computed(() => rightDrawer.value.tts);

const actions = computed(() => {
  return [
    {
      label: 'Manage AI Agents',
      value: 'ai',
      icon: 'mdi-creation',
      show: true
    },
    {
      label: 'Manage Services',
      value: 'service',
      icon: 'language',
      show: true
    },
    {
      label: 'Pin',
      value: 'pin',
      icon: 'push_pin',
      show: props.main,
      selected: rightDrawerShow.value,
      separator: true
    },
    {
      label: 'Split',
      value: 'split',
      icon: 'splitscreen',
      show: props.main,
      selected: rightDrawer.value.split
    },
    {
      label: 'Close',
      value: 'close',
      icon: 'close',
      show: true,
      separator: true
    },
  ];
});

function onAction (action :any) {
  switch (action.value) {
    case 'ai':
      showAiAgent(true);
      break;
    case 'close':
      onClose();
      break;
    case 'pin':
      onPin();
      break;
    case 'service':
      showAddService(true);
      break;
    case 'split':
      setRightDrawerSplit(!rightDrawer.value.split);
      break;
  }
}

function onClose() {
  if (props.main) {
    //
  } else {
    setRightDrawerSplit(false);
  }
}

function onPin() {
  const show = rightDrawerShow.value;
  toggleRightDrawer();
  if (show) {
    setRightDrawerHoverShow(true);
  }
}

function showAiAgent(value :boolean) {
  addAiAgentStatus.value = value;
}

function showAddService(value :boolean) {
  addServiceStatus.value = value;
}

function toggleSettings() {
  settingsStatus.value = !settingsStatus.value;
}

function toggleTTS() {
  ttsStatus.value = !ttsStatus.value;
}

function onAddService(item :any) {
  addServiceStatus.value = false;
  const exist = tabs.value.find((e) => e.value === item.value);
  if (!exist) {
    if (props.main) {
      mainService.value.push(item);
    } else {
      secondaryService.value.push(item);
    }

    console.log('tabs', tabs.value)
    currentTab.value = tabs.value.length - 1;
  }
}

function onRemoveService() {
  currentTab.value = 0;
}

watch(() => showTTS.value, (newValue) => {
  console.log('tts', newValue)
}, { deep: true })

onBeforeMount(() => {
  currentTab.value = 0;
})
</script>

<style lang="scss">
.reader-side-panel {
  header.toolbar {
    .q-tabs {
      .q-tab {
        padding: 0;
        border-radius: 4px;
        width: 28px;
        height: 28px;
        min-height: unset;

        &--active:before {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          width: 100%;
          height: 100%;
          background: var(--q-primary);
          border-radius: 4px;
          opacity: 0.1;
        }
        &:not(:first-child) {
          margin-left: 2px;
        }

        .q-icon {
          font-size: 20px;
        }
        img {
          width: 20px;
        }
      }

      .q-tabs__arrow--left, .q-tabs__arrow--right {
        background: var(--q-accent);
      }
    }
  }

  .side-fixed {
    position: fixed;
    left: 8px;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 99999;
  }
}
</style>
