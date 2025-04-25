<template>
  <section class="reader-side-panel">
    <header class="row col-12 justify-between items-center text-readable">
      <section class="col row items-center">
        <q-tabs v-model="currentTab"
                active-color="primary"
                indicator-color="transparent"
                dense
                narrow-indicator
                shrink
                v-if="true">
          <template v-for="(item, index) in tabs" :key="index">
            <q-tab :name="index">
              <q-icon :name="item.icon" />
              <o-tooltip :message="item.label" />
            </q-tab>
          </template>
        </q-tabs>
      </section>

      <section class="col-auto">
        <q-btn icon="more_horiz" class="o-toolbar-btn" flat>
          <q-menu class="o-menu">
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
      <add-ai-agent v-if="addAiAgentStatus"
                    @close="showAiAgent(false)" />
    </transition>

    <transition appear
                enter-active-class="animated slideInRight"
                leave-active-class="animated slideOutRight">
      <add-service v-if="addServiceStatus"
                   @close="showAddService(false)"
                   @select="selectAddService" />
    </transition>
  </section>
</template>

<script setup lang="ts">
import {computed, onBeforeMount, PropType, ref} from 'vue';
import useReader from 'src/hooks/useReader';
import ReaderSide from 'src/components/reader/ReaderSide.vue';
import AddAiAgent from 'src/components/reader/AddAiAgent.vue';
import AddService from 'src/components/reader/AddService.vue';

const props = defineProps({
  main: {
    type: Boolean,
    default: false
  }
});

const {
  rightDrawer,
  rightDrawerShow,
  setRightDrawerHoverShow,
  setRightDrawerSplit,
  toggleRightDrawer
} = useReader();

const currentTab = ref(0);
const tabs = ref([
  { label: 'AI', value: 'chat', type: 'ai', icon: 'mdi-creation' },
]);
const addAiAgentStatus = ref(false);
const addServiceStatus = ref(false);

const components = computed(() => {
  return tabs.value.map((item) => {
    return {
      value: item.value,
      component: ReaderSide,
      item: item
    };
  });
});

const actions = computed(() => {
  return [
    {
      label: 'Add AI Agent',
      value: 'ai',
      icon: 'mdi-creation',
      show: true
    },
    {
      label: 'Add Service',
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

function selectAddService(item :any) {
  addServiceStatus.value = false;
  console.log('service', item);

  const addedTab = tabs.value.find((e) => e.value === item.value);
  if (!addedTab) {
    tabs.value.push(item);
    currentTab.value = tabs.value.length - 1;
  }
}

onBeforeMount(() => {
  currentTab.value = 0;
})
</script>

<style lang="scss">
.reader-side-panel {
  header {
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
      }

      .q-tabs__arrow--left, .q-tabs__arrow--right {
        background: var(--q-accent);
      }
    }
  }

  .reader-add-ai-agent, .reader-add-service {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
  }
}
</style>
