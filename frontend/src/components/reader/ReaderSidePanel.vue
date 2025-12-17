<template>
  <section class="reader-side-panel">
    <o-tool-bar v-if="rightDrawerShow" />
    <header class="row col-12 justify-between items-center text-readable toolbar">
      <section class="col row items-center">
        <q-tabs v-model="currentTab"
                active-color="primary"
                indicator-color="transparent"
                dense
                narrow-indicator
                shrink v-if="false">
          <template v-for="(item, index) in tabs" :key="index">
            <q-tab :name="item.value">
              <o-icon :name="item.icon" size="20px" class="rounded-borders" />
              <o-tooltip :message="item.label" />
            </q-tab>
          </template>
        </q-tabs>

        <o-menu-btn :label="tab?.label"
                    class="bg-accent"
                    anchor="bottom left"
                    self="top left"
                    min-width="240px"
                    flat dense dropdown>
          <template #icon>
            <o-icon :name="tab?.icon" width="20px" />
          </template>
          <template #menu>
            <template v-for="(item, index) in tabs" :key="index">
              <q-separator class="bg-accent" v-if="item.separator" />
              <q-item-label caption v-if="item.group">
                {{item.group}}
              </q-item-label>
              <o-common-item v-bind="item"
                             @click="onSelectTab(item)"
                             clickable closable dense right-side>
                <template #side>
                  <q-btn icon="close" flat round dense v-if="!['chat', 'agentAdd', 'serviceAdd'].includes(item.value)">
                    <o-tooltip position="right">{{$t('remove')}}</o-tooltip>
                  </q-btn>
                </template>
              </o-common-item>
            </template>
          </template>
        </o-menu-btn>
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
    <q-scroll-area class="o-scroll-wrapper" :class="{'with-title-bar': rightDrawerShow}">
      <q-tab-panels v-model="currentTab"
                    class="o-page-container bg-transparent"
                    keep-alive>
        <template v-for="(item, index) in components" :key="index">
          <q-tab-panel :name="item.value">
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
import { computed, onBeforeMount, ref, watch } from 'vue'
import useReader from 'src/hooks/useReader'
import ReaderSide from 'src/components/reader/ReaderSide.vue'
import AiAgentManager from 'components/reader/agent/ai-agent-manager.vue'
import WebServiceManager from 'components/reader/service/web-service-manager.vue'
import ReaderSettings from 'src/components/reader/settings/index.vue'
import TtsPlayer from 'src/components/reader/tts/tts-player.vue'
import OToolBar from 'core/components/electron/OToolBar.vue'
import OMenuBtn from 'core/components/menu/OMenuBtn.vue'

const props = defineProps({
  main: {
    type: Boolean,
    default: false
  }
})

const {
  mainService,
  secondaryService,
  rightDrawer,
  rightDrawerShow,
  setRightDrawerHoverShow,
  setRightDrawerSplit,
  setRightDrawerTTS,
  closeRightDrawer,
  toggleRightDrawer
} = useReader()

const currentTab = ref('chat')
const addAiAgentStatus = ref(false)
const addServiceStatus = ref(false)
const settingsStatus = ref(false)
const ttsStatus = computed({
  get() {
    return rightDrawer.value.tts
  },
  set(val: boolean) {
    setRightDrawerTTS(val)
  }
})

const defaultTab = computed(() => {
  return { label: 'AI Assistant', value: 'chat', type: 'ai', icon: 'mdi-creation' }
})
const tabs = computed(() => {
  const list = props.main
    ? [ defaultTab.value, ...mainService.value ]
    : [ defaultTab.value, ...secondaryService.value ]
  const aiList = list.filter(t => t.type === 'ai')
  aiList.push(
    { label: 'Manage AI Agents', value: 'agentAdd', type: 'ai', icon: 'mdi-tune-vertical-variant', separator: true }
  )
  aiList[0]!.group = 'AI Agents'

  const serviceList = list.filter(t => t.type === 'service')
  serviceList.push(
    { label: 'Manage Services', value: 'serviceAdd', type: 'service', icon: 'mdi-tune-vertical-variant', separator: true }
  )
  serviceList[0]!.group = 'Services'
  serviceList[0]!.separator = true

  return [...aiList, ...serviceList]
})
const tab = computed(() => {
  return tabs.value.find(t => t.value === currentTab.value)
})

const components = computed(() => {
  return tabs.value.map((item) => {
    return {
      value: item.value,
      component: ReaderSide,
      item: item
    }
  })
})
const showTTS = computed(() => rightDrawer.value.tts)

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
      show: props.main && false, // todo
      selected: rightDrawerShow.value,
      separator: true,
    },
    {
      label: 'Split',
      value: 'split',
      icon: 'splitscreen',
      show: props.main && false, // todo
      selected: rightDrawer.value.split
    },
    {
      label: 'Close',
      value: 'close',
      icon: 'close',
      show: rightDrawerShow.value,
      separator: true
    },
  ]
})

function onAction (action :any) {
  switch (action.value) {
    case 'ai':
      showAiAgent(true)
      break
    case 'close':
      onClose()
      break
    case 'pin':
      onPin()
      break
    case 'service':
      showAddService(true)
      break
    case 'split':
      setRightDrawerSplit(!rightDrawer.value.split)
      break
  }
}

function onClose() {
  setTimeout(() => {
    if (props.main) {
      closeRightDrawer()
    } else {
      setRightDrawerSplit(false)
    }
  }, 10)
}

function onPin() {
  const show = rightDrawerShow.value
  toggleRightDrawer()
  if (show) {
    setRightDrawerHoverShow(true)
  }
}

function showAiAgent(value :boolean) {
  addAiAgentStatus.value = value
}

function showAddService(value :boolean) {
  addServiceStatus.value = value
}

function toggleSettings() {
  settingsStatus.value = !settingsStatus.value
}

function toggleTTS() {
  ttsStatus.value = !ttsStatus.value
}

function onSelectTab(item: Indexable) {
  console.log('tab', item)
  switch (item.value) {
    case 'agentAdd':
      showAiAgent(true)
      break
    case 'serviceAdd':
      showAddService(true)
      break
    default:
      currentTab.value = item.value
      break
  }
}

function onAddService(item :any) {
  // addServiceStatus.value = false
  const exist = tabs.value.find((e) => e.value === item.value)
  if (!exist) {
    if (props.main) {
      mainService.value.push(item)
    } else {
      secondaryService.value.push(item)
    }
  }
  currentTab.value = item.value
}

function onRemoveService() {
  currentTab.value = 'chat'
}

watch(() => showTTS.value, (newValue) => {
  console.log('tts', newValue)
}, { deep: true })

onBeforeMount(() => {
  currentTab.value = 'chat'
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
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 99999;
  }
}
</style>
