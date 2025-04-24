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
      <note-list :max-width="maxWidth" v-show="activity === 'note'" />
      <chat-session-list :max-width="maxWidth" v-show="activity === 'chat'" />
      <knowledge-list :max-width="maxWidth" v-show="activity === 'knowledge'" />
    </template>
  </drawer-navi>
</template>

<script setup lang="ts">
import { computed, onBeforeMount } from 'vue';

import DrawerNavi from 'core/page/DrawerNavi.vue'
import ONaviExpansionItem from 'core/components/navi/ONaviExpansionItem.vue'
import NoteList from './note/note-list.vue';
import NoteTree from './note/note-tree.vue';
import ChatSessionList from './chat/chat-session-list.vue';
import KnowledgeList from './knowledge/knowledge-list.vue';

import useNavi from 'src/hooks/useNavi';

const props = defineProps({
  maxWidth: {
    type: Number,
    default: 300
  },
});

const { activity, findTopConsoleMenu } = useNavi();

const activeMenu = computed(() => {
  return findTopConsoleMenu(activity.value);
})

onBeforeMount(() => {
  // this.initCurrentMenu()
})

</script>

<style lang="scss">
.navi-list {
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
      height: 50px;
      .q-icon {
        font-size: 1.5rem;
      }
      svg {
        width: 1.6rem;
        height: 1.6rem;
      }

      &.active:after {
        content: "";
        width: 2px;
        height: 20px;
        position: absolute;
        right: 0;
        top: 15px;
        background-color: var(--q-primary);
      }
    }
  }

  .o-navi-item {
    margin-bottom: 2px;
  }
}
</style>
