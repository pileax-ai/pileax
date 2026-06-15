<template>
  <section>
    <section class="agent-view no-drag-region bg-secondary side-fixed"
             :class="{ 'active': currentView === 'agent' }">
      <header class="row col-12 justify-between items-center text-readable toolbar">
        <section class="col row items-center">
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
                               :class="{ 'active': item.value === tab.value }"
                               @click="onSelectTab(item)"
                               clickable closable dense right-side>
                  <template #side>
                    <q-btn icon="close" flat round dense
                           v-if="!['chat', 'agentAdd', 'serviceAdd'].includes(item.value) && false">
                      <o-tooltip position="right">{{$t('remove')}}</o-tooltip>
                    </q-btn>
                  </template>
                </o-common-item>
              </template>
            </template>
          </o-menu-btn>
        </section>

        <section class="col-auto">
          <q-btn icon="more_horiz" class="o-toolbar-btn" flat>
            <q-menu class="pi-menu" :offset="[0, 4]">
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
    </section>

    <transition appear
                enter-active-class="animated slideInRight"
                leave-active-class="animated slideOutRight">
      <ai-agent-manager class="side-fixed"
                        :class="{ 'active': currentView === 'ai-agent-manager' }"
                        :main="main"
                        @close="showAiAgent(false)"
                        v-if="addAiAgentStatus" />
    </transition>

    <transition appear
                enter-active-class="animated slideInRight"
                leave-active-class="animated slideOutRight">
      <web-service-manager class="side-fixed"
                           :class="{ 'active': currentView === 'web-service-manager' }"
                           :main="main"
                           @close="showAddService(false)"
                           @add="onAddService"
                           @remove="onRemoveService"
                           v-if="addServiceStatus" />
    </transition>
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, ref } from 'vue'
import OMenuBtn from 'core/components/menu/OMenuBtn.vue'
import ReaderSide from 'components/reader/ReaderSide.vue'
import AiAgentManager from 'components/reader/agent/ai-agent-manager.vue'
import WebServiceManager from 'components/reader/service/web-service-manager.vue'

import useCommon from 'core/hooks/useCommon'
import useReader from 'src/hooks/useReader'
import TtsPlayer from 'components/reader/tts/tts-player.vue'

const props = defineProps({
  main: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['close'])

const { t } = useCommon()
const {
  currentMainService,
  mainService,
  secondaryService,
  rightDrawer,
  rightDrawerShow,
  setCurrentMainService,
  closeRightDrawer,
  toggleRightDrawer,
  setRightDrawerHoverShow,
  setRightDrawerView,
  setRightDrawerSplit,
} = useReader()
const addAiAgentStatus = ref(false)
const addServiceStatus = ref(false)

const currentView = computed(() => rightDrawer.value.view)

const currentTab = computed({
  get() {
    return currentMainService.value
  },
  set(val: string) {
    setCurrentMainService(val)
  }
})


const defaultTab = computed(() => {
  return { label: t('reading.agent._'), value: 'chat', type: 'ai', icon: 'mdi-creation' }
})
const tabs = computed(() => {
  const list = props.main
    ? [ defaultTab.value, ...mainService.value ]
    : [ defaultTab.value, ...secondaryService.value ]
  const aiList = list.filter(t => t.type === 'ai') as Indexable[]
  aiList.push(
    { label: t('reading.agent.manage'), value: 'agentAdd', type: 'ai', icon: 'mdi-tune-vertical-variant', separator: true }
  )
  aiList[0]!.group = t('reading.agent.agents')

  const serviceList = list.filter(t => t.type === 'service') as Indexable[]
  serviceList.push(
    { label: t('reading.service.manage'), value: 'serviceAdd', type: 'service', icon: 'mdi-tune-vertical-variant', separator: true }
  )
  serviceList[0]!.group = t('reading.service.services')
  serviceList[0]!.separator = true

  return [...aiList, ...serviceList]
})
const tab = computed(() => {
  return tabs.value.find(t => t.value === currentTab.value) as Indexable
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

const actions = computed(() => {
  return [
    {
      label: t('reading.agent.manage'),
      value: 'ai',
      icon: 'mdi-creation',
      show: true
    },
    {
      label: t('reading.service.manage'),
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
      label: t('close'),
      value: 'close',
      icon: 'close',
      show: rightDrawerShow.value,
      separator: true
    },
    {
      label: t('pin'),
      value: 'pin',
      icon: 'mdi-pin-outline',
      show: !rightDrawerShow.value,
      separator: true
    },
  ]
})

function onAction (action :any) {
  switch (action.value) {
    case 'ai':
      showAiAgent(true)
      break
    case 'service':
      showAddService(true)
      break
    case 'close':
      onClose()
      break
    case 'pin':
      onPin()
      break
  }
}


function onSelectTab(item: Indexable) {
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

function showAiAgent(value :boolean) {
  addAiAgentStatus.value = value
  setRightDrawerView('ai-agent-manager', value)
}

function showAddService(value :boolean) {
  addServiceStatus.value = value
  setRightDrawerView('web-service-manager', value)
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
  setRightDrawerHoverShow(false)
  toggleRightDrawer()
}

onBeforeMount(() => {
  currentTab.value = 'chat'
})
</script>

<style lang="scss">
.agent-view {
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
}
</style>
