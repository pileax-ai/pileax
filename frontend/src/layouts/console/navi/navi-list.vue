<template>
  <drawer-navi class="navi-list">
    <template #content>
      <q-separator class="bg-dark" />
      <q-list class="list" v-show="activeMenu.children?.length">
        <o-navi-expansion-item class="root-item"
                               :parent-key="activity"
                               :data="activeMenu"
                               :show-icon="false"
                               root
                               show-item-icon separator />
      </q-list>

      <template v-if="workspace?.id">
        <note-list :max-width="maxWidth" v-show="activity.indexOf('note') === 0" />
        <ai-assistant-list :max-width="maxWidth" v-show="activity.indexOf('chat') === 0" />
        <!--      <knowledge-list :max-width="maxWidth" v-show="activity === 'knowledge'" />-->
      </template>
    </template>
  </drawer-navi>
</template>

<script setup lang="ts">
import { computed, onBeforeMount } from 'vue'

import DrawerNavi from 'core/page/DrawerNavi.vue'
import ONaviExpansionItem from 'core/components/navi/ONaviExpansionItem.vue'
import NoteList from './note/note-list.vue'
import AiAssistantList from './chat/ai-assistant-list.vue'
import KnowledgeList from './knowledge/knowledge-list.vue'

import useAccount from 'src/hooks/useAccount'
import useNavi from 'src/hooks/useNavi'

const props = defineProps({
  maxWidth: {
    type: Number,
    default: 300
  },
})

const { workspace } = useAccount()
const { activity, findTopConsoleMenu } = useNavi()

const activeMenu = computed(() => {
  return findTopConsoleMenu(activity.value)
})

onBeforeMount(() => {
  // this.initCurrentMenu()
})

</script>

<style lang="scss">
.navi-list {

  .q-list {
    padding: 0 8px 8px 8px;

    .q-item {
      border-radius: 4px;

      &:before {
        border-radius: 4px;
      }

      &:after {
        //background: none;
      }
    }
  }
  .group {
    padding: 8px 10px;
  }

  .header-item.root {
    height: 40px !important;
    min-height: unset;
  }

  .root-item > .q-expansion-item > .q-expansion-item__container > .q-item {
    .title {
      padding-left: 30px;
      text-align: center;
      font-weight: 600;
    }
  }

  .q-expansion-item {
    .q-item {
      .q-icon {
        font-size: 1.5rem;
      }
      svg {
        width: 1.6rem;
        height: 1.6rem;
      }
    }
  }

  .o-navi-item {
  }
}
</style>
