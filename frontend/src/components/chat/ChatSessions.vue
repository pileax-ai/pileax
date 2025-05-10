<template>
  <section class="chat-sessions">
    <q-list>
      <template v-for="(group, groupName) in groupedSession"
                :key="groupName">
        <template v-if="groupName === 'byMonth'">
          <template v-for="(subGroup, subGroupName) in group"
                    :key="subGroupName">
            <q-item-label class="text-tips bg-secondary group">
              {{ subGroupName }}
            </q-item-label>
            <template v-for="(item, index) in subGroup as ChatSession[]"
                      :key="index">
              <chat-session-item :item="item"
                                 :active-id="activeId"
                                 :closable="closable"
                                 @open="emit('open', item)"
                                 @updated="onItemUpdated" />
            </template>
          </template>
        </template>
        <template v-else>
          <template v-if="(group as ChatSession[]).length">
            <q-item-label class="text-tips bg-secondary group">
              {{ $t(groupName) }}
            </q-item-label>
            <template v-for="(item, index) in group as ChatSession[]"
                      :key="index">
              <chat-session-item :item="item"
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
import { chatSessionService } from 'src/service/remote/chat-session';
import { ChatSession } from 'src/types/chat';
import ChatSessionItem from 'components/chat/ChatSessionItem.vue';

type GroupedSessions = {
  favorite: ChatSession[];
  today: ChatSession[];
  yesterday: ChatSession[];
  last7Days: ChatSession[];
  last30Days: ChatSession[];
  byMonth: Record<string, ChatSession[]>;
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

const sessions = ref<ChatSession[]>([]);
const groupedSession = computed(() => {
  return groupSessionsByTime(sessions.value);
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
  chatSessionService.query(query).then(res => {
    sessions.value = res.list;
  })
}

function groupSessionsByTime(sessions: ChatSession[]): GroupedSessions {
  const now = new Date();
  const todayStart = new Date(now.setHours(0, 0, 0, 0));
  const yesterdayStart = new Date(new Date().setDate(now.getDate() - 1));
  const sevenDaysAgo = new Date(new Date().setDate(now.getDate() - 7));
  const thirtyDaysAgo = new Date(new Date().setDate(now.getDate() - 30));

  const result: GroupedSessions = {
    favorite: [],
    today: [],
    yesterday: [],
    last7Days: [],
    last30Days: [],
    byMonth: {},
  };

  sessions.forEach((session) => {
    const sessionDate = new Date(session.createTime);

    if (session.favorite === 1) {
      result.favorite.push(session);
      return;
    }

    // Day group
    if (sessionDate >= todayStart) {
      result.today.push(session);
    } else if (sessionDate >= yesterdayStart) {
      result.yesterday.push(session);
    }  else if (sessionDate >= sevenDaysAgo) {
      result.last7Days.push(session);
    } else if (sessionDate >= thirtyDaysAgo) {
      result.last30Days.push(session);
    } else {
      const monthKey = `${sessionDate.getFullYear()}-${String(sessionDate.getMonth() + 1).padStart(2, '0')}`;

      // Month group
      if (!result.byMonth[monthKey]) {
        result.byMonth[monthKey] = [];
      }
      result.byMonth[monthKey].push(session);
    }
  });

  // Deduplicate
  result.last7Days = result.last7Days.filter(
    (session) => !result.today.includes(session)
  );
  result.last30Days = result.last30Days.filter(
    (session) => !result.today.includes(session) && !result.last7Days.includes(session)
  );

  return result;
}

function onItemUpdated(item: ChatSession) {
  const idx = sessions.value.findIndex(s => s.id === item.id);
  if (idx >= 0) {
    sessions.value.splice(idx, 1, item);
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
.chat-sessions {
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
