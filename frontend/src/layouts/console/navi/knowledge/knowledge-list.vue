<template>
  <section class="knowledge-list fit" :style="`max-width: ${maxWidth}px`">
    <section class="session-panel">
      <q-list>
        <template v-for="(group, groupName) in groupedList" :key="groupName">
          <template v-if="groupName === 'byMonth'">
            <template v-for="(subGroup, subGroupName) in group" :key="subGroupName">
              <q-item-label class="text-tips group">{{ subGroupName }}</q-item-label>
              <template v-for="(item, index) in subGroup as Knowledge[]" :key="index">
                <q-item class="o-navi-item"
                        :class="{'active': currentMenu.id === item.id}"
                        clickable
                        @click="openKnowledge(item)">
                  <q-item-section>
                    <q-item-label>
                      {{ item.name }}
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </template>
          </template>
          <template v-else>
            <template v-if="(group as Knowledge[]).length">
              <q-item-label class="text-tips group">{{ $t(groupName) }}</q-item-label>
              <template v-for="(item, index) in group as Knowledge[]" :key="index">
                <q-item class="o-navi-item"
                        :class="{'active': currentMenu.id === item.id}"
                        clickable
                        @click="openKnowledge(item)">
                  <q-item-section>
                    <q-item-label lines="1">
                      {{ item.name }}
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
import { knowledgeService } from 'src/service/remote/knowledge';
import { Knowledge } from 'src/types/knowledge';
import { router } from 'src/router';
import useKnowledge from 'src/hooks/useKnowledge.js';
import useNavi from 'src/hooks/useNavi.js';

type GroupedSessions = {
  today: Knowledge[];
  yesterday: Knowledge[];
  last7Days: Knowledge[];
  last30Days: Knowledge[];
  byMonth: Record<string, Knowledge[]>;
};

defineProps({
  maxWidth: {
    type: Number,
    default: 300
  },
});
const { queryTimer } = useKnowledge();
const { openDialog } = useDialog();
const { currentMenu } = useNavi();
const list = ref<Knowledge[]>([]);
const groupedList = computed(() => {
  return groupByTime(list.value);
})

async function getList() {
  const query = {
    pageIndex: 1,
    pageSize: 100,
    sort: {
      updateTime: 'desc'
    }
  }
  knowledgeService.query(query).then(res => {
    list.value = res.list;
  })
}

function openKnowledge(item: Knowledge) {
  router.push({name: 'knowledge', params: {id: item.id}});
}

function groupByTime(knowledgeList: Knowledge[]): GroupedSessions {
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

  knowledgeList.forEach((item) => {
    const date = new Date(item.createTime);

    // Day group
    if (date >= todayStart) {
      result.today.push(item);
    } else if (date >= yesterdayStart) {
      result.yesterday.push(item);
    }  else if (date >= sevenDaysAgo) {
      result.last7Days.push(item);
    } else if (date >= thirtyDaysAgo) {
      result.last30Days.push(item);
    } else {
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      // Month group
      if (!result.byMonth[monthKey]) {
        result.byMonth[monthKey] = [];
      }
      result.byMonth[monthKey].push(item);
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

watch(() => queryTimer.value, (newValue) => {
  getList();
})

onBeforeMount(() => {
  getList();
})
</script>

<style lang="scss">
.knowledge-list {

}
</style>
