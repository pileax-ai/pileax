<template>
  <section class="chat-session-list fit" :style="`max-width: ${maxWidth}px`">
    <section class="session-panel">
      <q-list>
        <template v-for="(group, groupName) in groupedSession" :key="groupName">
          <template v-if="groupName === 'byMonth'">
            <template v-for="(subGroup, subGroupName) in group" :key="subGroupName">
              <q-item-label class="text-tips group">{{ subGroupName }}</q-item-label>
              <template v-for="(item, index) in subGroup as ChatSession[]" :key="index">
                <q-item class="o-navi-item"
                        :class="{'active': currentMenu.id === item.id}"
                        clickable
                        @click="openSession(item)">
                  <q-item-section>
                    <q-item-label>
                      {{ item.title }}
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </template>
          </template>
          <template v-else>
            <template v-if="(group as ChatSession[]).length">
              <q-item-label class="text-tips group">{{ $t(groupName) }}</q-item-label>
              <template v-for="(item, index) in group as ChatSession[]" :key="index">
                <q-item class="o-navi-item"
                        :class="{'active': currentMenu.id === item.id}"
                        clickable
                        @click="openSession(item)">
                  <q-item-section>
                    <q-item-label lines="1">
                      {{ item.title }}
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </template>
          </template>
        </template>
      </q-list>
    </section>
  </section>
</template>

<script setup lang="ts">
import {computed, onBeforeMount, ref, watch} from 'vue';
import useDialog from 'core/hooks/useDialog';
import { chatSessionService } from 'src/service/remote/chat-session';
import { ChatSession } from 'src/types/chat';
import { router } from 'src/router';
import useChatSession from 'src/hooks/useChatSession.js';
import useNavi from 'src/hooks/useNavi.js';

type GroupedSessions = {
  today: ChatSession[];
  yesterday: ChatSession[];
  last7Days: ChatSession[];
  last30Days: ChatSession[];
  byMonth: Record<string, ChatSession[]>;
};

defineProps({
  maxWidth: {
    type: Number,
    default: 300
  },
});
const { sessionTimer } = useChatSession();
const { openDialog } = useDialog();
const { currentMenu } = useNavi();
const sessions = ref<ChatSession[]>([]);
const groupedSession = computed(() => {
  return groupSessionsByTime(sessions.value);
})

async function getSessions() {
  const query = {
    pageIndex: 1,
    pageSize: 100,
    orderBy: {
      updateTime: 'desc'
    }
  }
  chatSessionService.query(query).then(res => {
    sessions.value = res;
  })
}

function openSession(item: ChatSession) {
  router.push({name: 'chat-session', params: {id: item.id}});
}

function groupSessionsByTime(sessions: ChatSession[]): GroupedSessions {
  const now = new Date();
  const todayStart = new Date(now.setHours(0, 0, 0, 0));
  const yesterdayStart = new Date(new Date().setDate(now.getDate() - 1));
  const sevenDaysAgo = new Date(new Date().setDate(now.getDate() - 7));
  const thirtyDaysAgo = new Date(new Date().setDate(now.getDate() - 30));

  const result: GroupedSessions = {
    today: [],
    yesterday: [],
    last7Days: [],
    last30Days: [],
    byMonth: {},
  };

  sessions.forEach((session) => {
    const sessionDate = new Date(session.createTime);

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

watch(() => sessionTimer.value, (newValue) => {
  getSessions();
})

onBeforeMount(() => {
  getSessions();
})
</script>

<style lang="scss">
.chat-session-list {

}
</style>
