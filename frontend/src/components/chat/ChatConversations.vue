<template>
  <section class="chat-conversations">
    <q-list>
      <template v-for="(group, groupName) in groupedConversation"
                :key="groupName">
        <template v-if="groupName === 'byMonth'">
          <template v-for="(subGroup, subGroupName) in group"
                    :key="subGroupName">
            <q-item-label class="text-tips bg-secondary group">
              {{ subGroupName }}
            </q-item-label>
            <template v-for="(item, index) in subGroup as ChatConversation[]"
                      :key="index">
              <chat-conversation-item :item="item"
                                      :active-id="activeId"
                                      :closable="closable"
                                      @open="emit('open', item)"
                                      @updated="onItemUpdated" />
            </template>
          </template>
        </template>
        <template v-else>
          <template v-if="(group as ChatConversation[]).length">
            <q-item-label class="text-tips bg-secondary group">
              {{ $t(groupName) }}
            </q-item-label>
            <template v-for="(item, index) in group as ChatConversation[]"
                      :key="index">
              <chat-conversation-item :item="item"
                                      :active-id="activeId"
                                      :closable="closable"
                                      @open="emit('open', item)"
                                      @updated="onItemUpdated" />
            </template>
          </template>
        </template>
      </template>
    </q-list>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { chatConversationService } from 'src/api/service/remote/chat-conversation';
import { ChatConversation } from 'src/types/chat';
import ChatConversationItem from 'components/chat/ChatConversationItem.vue';

type GroupedConversations = {
  favorite: ChatConversation[];
  today: ChatConversation[];
  yesterday: ChatConversation[];
  last7Days: ChatConversation[];
  last30Days: ChatConversation[];
  byMonth: Record<string, ChatConversation[]>;
};

const props = defineProps({
  refType: {
    type: String,
    default: 'general'
  },
  refId: {
    type: String,
    default: ''
  },
  maxWidth: {
    type: Number,
    default: 300
  },
  activeId: {
    type: String,
    default: ''
  },
  closable: {
    type: Boolean,
    default: false
  },
});
const emit = defineEmits(['open']);

const conversations = ref<ChatConversation[]>([]);
const groupedConversation = computed(() => {
  return groupConversationsByTime(conversations.value);
})

async function refresh(openFirst = false) {
  const query = {
    pageIndex: 1,
    pageSize: 100,
    condition: {
      refType: props.refType,
      refId: props.refId
    },
    sort: {
      updateTime: 'desc'
    }
  }
  chatConversationService.query(query).then(res => {
    conversations.value = res.list;
  })
}

function groupConversationsByTime(conversations: ChatConversation[]): GroupedConversations {
  const now = new Date();
  const todayStart = new Date(now.setHours(0, 0, 0, 0));
  const yesterdayStart = new Date(new Date().setDate(now.getDate() - 1));
  const sevenDaysAgo = new Date(new Date().setDate(now.getDate() - 7));
  const thirtyDaysAgo = new Date(new Date().setDate(now.getDate() - 30));

  const result: GroupedConversations = {
    favorite: [],
    today: [],
    yesterday: [],
    last7Days: [],
    last30Days: [],
    byMonth: {},
  };

  conversations.forEach((conversation) => {
    const conversationDate = new Date(conversation.createTime);

    if (conversation.favorite === 1) {
      result.favorite.push(conversation);
      return;
    }

    // Day group
    if (conversationDate >= todayStart) {
      result.today.push(conversation);
    } else if (conversationDate >= yesterdayStart) {
      result.yesterday.push(conversation);
    }  else if (conversationDate >= sevenDaysAgo) {
      result.last7Days.push(conversation);
    } else if (conversationDate >= thirtyDaysAgo) {
      result.last30Days.push(conversation);
    } else {
      const monthKey = `${conversationDate.getFullYear()}-${String(conversationDate.getMonth() + 1).padStart(2, '0')}`;

      // Month group
      if (!result.byMonth[monthKey]) {
        result.byMonth[monthKey] = [];
      }
      result.byMonth[monthKey].push(conversation);
    }
  });

  // Deduplicate
  result.last7Days = result.last7Days.filter(
    (conversation) => !result.today.includes(conversation)
  );
  result.last30Days = result.last30Days.filter(
    (conversation) => !result.today.includes(conversation) && !result.last7Days.includes(conversation)
  );

  return result;
}

function onItemUpdated(item: ChatConversation) {
  const idx = conversations.value.findIndex(s => s.id === item.id);
  if (idx >= 0) {
    conversations.value.splice(idx, 1, item);
  }
}

onMounted(() => {
  refresh();
})

defineExpose({
  refresh: refresh
})
</script>

<style lang="scss">
.chat-conversations {
  width: 100%;
  overflow: hidden;
  .q-list {
    padding: 10px;

  }
  .group {
    position: sticky;
    top: 0;
    z-index: 1;
    padding: 4px 0;
  }
}
</style>
