<template>
  <q-list class="conversation-list" bordered separator>
    <template v-for="(item, index) in list" :key="index">
      <q-item class="o-navi-items" clickable @click="openConversation(item)">
        <q-item-section class="row item-label">
          <q-item-label lines="1">
            {{ item.name }}
          </q-item-label>
        </q-item-section>
        <q-item-section side>
          <div class="row items-center">
            {{ timeMulti(item.updateTime).fromNow() }}
            <q-icon name="chevron_right" size="1.2rem" class="q-ml-md" />
          </div>
        </q-item-section>
      </q-item>
    </template>
  </q-list>
</template>

<script setup lang="ts">
import { computed, PropType } from 'vue'
import { timeMulti } from 'core/utils/dayjs'
import useCommon from 'core/hooks/useCommon'
import { router } from 'src/router'

const props = defineProps({
  items: {
    type: Array as PropType<Indexable[]>,
    default: () => {
      return []
    }
  },
})

const { t } = useCommon()

const list = computed(() => {
  return props.items.length > 0
    ? props.items
    : [
      {
        name: t('chat.conversation.new'),
        updateTime: ''
      }
    ]
})

function openConversation(item: Indexable) {
  if (item.id) {
    router.push({name: 'chat-conversation',
      params: {appId: item.appId, id: item.id}})
  } else {
    router.push({name: 'chat-start'})
  }
}
</script>

<style lang="scss" scoped>
.conversation-list {
  border-radius: 10px;

  .q-item {
    &:first-child {
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
    }
    &:last-child {
      border-bottom-left-radius: 10px;
      border-bottom-right-radius: 10px;
    }
  }
}
</style>
