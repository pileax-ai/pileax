<template>
  <o-console-page ref="knowledgePage"
                  icon="mdi-database"
                  class="page-knowledge tabs"
                  disable-meta
                  extend-header
                  enable-fullscreen>
    <template #header-extension>
      <section class="knowledge-tabs">
        <q-btn-toggle
          v-model="currentTab"
          color="dark"
          text-color="readable"
          toggle-color="primary"
          toggle-text-color="white"
          class="pi-btn-group"
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
          <component :is="item.component"
                     :knowledge-id="knowledgeId"
                     :knowledge="knowledge" />
        </q-tab-panel>
      </template>
    </q-tab-panels>
  </o-console-page>
</template>

<script setup lang="ts">
import { computed, onActivated, onMounted, ref } from 'vue';

import useKnowledge from 'src/hooks/useKnowledge.js';
import { useRoute } from 'vue-router'
import { knowledgeService } from 'src/api/service/remote/knowledge'

const route = useRoute();
const { knowledgeId, knowledge, setCurrentKnowledge } = useKnowledge();
const currentTab = ref('dataset');

import ChatTab from './chat/index.vue'
import ConfigTab from './config/index.vue'
import DatesetTab from './dataset/index.vue'
import TestTab from './test/index.vue'

const tabs = computed(() => {
  return [
    // { label: 'Chat', value: 'chat', icon: 'forum', component: ChatTab },
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
      padding: 10px 21px 0 21px !important;
    }
    .header-extension .knowledge-tabs {
      position: absolute;
      top: 0;
      left: 100px;
      right: 100px;
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
      padding-top: 10px;

      .q-btn-group {
        .q-btn {
          height: 40px;
          min-width: 100px;
        }
      }
    }
  }
  .console-content {
    padding: 0;
  }

  .q-tab-panel {
    .console-content {
      padding: 0 21px;
    }
  }

  &.page-full-screen {
    .console-header {
      .header-extension .knowledge-tabs {
        padding: 0;
      }

    }
  }
}
</style>
