<template>
  <o-console-page ref="notePage"
                  icon="mdi-database"
                  class="page-knowledge tabs"
                  extend-header
                  enable-fullscreen>
    <template #header-extension>
      <section>
        <q-btn-toggle
          v-model="currentTab"
          color="dark"
          text-color="readable"
          toggle-color="primary"
          toggle-text-color="white"
          rounded
          unelevated
          :options="tabs"
        />
      </section>
    </template>

    <q-tab-panels v-model="currentTab"
                  class="bg-transparent"
                  keep-alive>
      <template v-for="(item, index) in tabs" :key="index">
        <q-tab-panel :name="item.value">
          <component :is="item.component" />
        </q-tab-panel>
      </template>
    </q-tab-panels>
  </o-console-page>
</template>

<script setup lang="ts">
import { computed, onActivated, onMounted, ref } from 'vue';

import useKnowledge from 'src/hooks/useKnowledge.js';
import { useRoute } from 'vue-router'
import { knowledgeService } from 'src/service/remote/knowledge'

const route = useRoute();
const { knowledgeId, knowledge, setCurrentKnowledge } = useKnowledge();
const currentTab = ref('dataset');

import ChatTab from './chat/index.vue'
import ConfigTab from './config/index.vue'
import DatesetTab from './dataset/index.vue'
import TestTab from './test/index.vue'

const tabs = computed(() => {
  return [
    { label: 'Chat', value: 'chat', icon: 'forum', component: ChatTab },
    { label: 'Dataset', value: 'dataset', icon: 'dataset', component: DatesetTab },
    { label: 'Test', value: 'test', icon: 'radio_button_checked', component: TestTab },
    { label: 'Config', value: 'config', icon: 'tune', component: ConfigTab },
  ];
})

function init() {
  knowledgeId.value = (route.params.id || '') as string;
  if (knowledgeId.value) {
    getKnowledge();
  }
}

async function getKnowledge() {
  knowledgeService.get(knowledgeId.value).then(res => {
    knowledge.value = res;
    setCurrentKnowledge(res);
  })
}

onActivated(() => {
  init();
})
</script>

<style lang="scss">
.page-knowledge {
  .console-header {
    .console-toolbar {
      padding: 16px 21px 0 21px !important;
    }
    .header-extension {
      position: absolute;
      top: 0;
      left: 100px;
      right: 100px;
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
      padding-top: 16px;

      .q-btn-group {
        .q-btn {
          height: 40px;
          min-width: 100px;

          .on-left {
            margin-right: 4px;
          }

          &:not(:first-child) {
            border-left: solid 1px var(--q-secondary);
          }
        }
      }
    }
  }
  .console-content {
    padding: 0;
  }

  .q-tab-panel {
    .console-header {
      display: none;
    }
    .console-content {
      padding: 0 21px;
    }
  }
}
</style>
