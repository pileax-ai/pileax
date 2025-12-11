<template>
  <q-item class="chat-conversation-item o-navi-item"
          :class="{'active': activeId === item.id, 'clicked': clicked}"
          clickable
          v-close-popup="closable"
          @click="openConversation(item)">
    <q-item-section v-if="editable">
      <q-input v-model="name" autofocus outlined dense
               @keyup.enter.stop="onBlur"
               @blur="onBlur" />
    </q-item-section>
    <template v-else>
      <q-item-section avatar>
        <q-btn class="pi-toolbar-btn" flat @click.stop="onToggleFavorite">
          <o-icon name="icon-star" class="text-amber"
                  size="1.2rem" v-if="item.favorite === 1" />
          <o-icon name="icon-star-outline"
                  size="1.2rem" v-else />
        </q-btn>
      </q-item-section>
      <q-item-section>
        <q-item-label lines="1">
          {{ item.name }}
        </q-item-label>
      </q-item-section>
      <q-item-section class="more" side>
        <q-btn class="pi-toolbar-btn" flat @click.stop="clicked=true">
          <o-icon name="more_vert"
                  size="1.2rem" />
          <q-menu class="pi-menu dense" @before-hide="clicked=false">
            <q-list :style="{minWidth: '160px'}">
              <template v-for="(action, index) in actions" :key="`action-${index}`">
                <q-separator class="bg-accent" v-if="action.separator" />
                <o-common-item v-bind="action"
                               class="text-tips"
                               @click="onAction(action)"
                               clickable closable>
                </o-common-item>
              </template>
              <q-separator class="bg-accent" />
              <o-common-item icon="schedule" class="text-tips"
                             :label="timeMulti(item.updateTime).timestamp" />
            </q-list>
          </q-menu>
        </q-btn>
      </q-item-section>
    </template>
  </q-item>
</template>

<script setup lang="ts">
import type { PropType} from 'vue'
import { computed, ref } from 'vue'
import { chatConversationService } from 'src/api/service/remote/chat-conversation'
import type { ChatConversation } from 'src/types/chat'
import { refresh } from 'core/hooks/useRouter'
import { timeMulti } from 'core/utils/format'

const props = defineProps({
  item: {
    type: Object as PropType<ChatConversation>,
    default: () => {
      return {}
    }
  },
  activeId: {
    type: String,
    default: ''
  },
  closable: {
    type: Boolean,
    default: false
  },
})
const emit = defineEmits(['open', 'updated'])
const clicked = ref(false)
const name = ref('')
const editable = ref(false)

const actions = computed(() => {
  return [
    { label: '智能重命名', value: 'edit', icon: 'draw' },
    { label: '重命名', value: 'rename', icon: 'edit' },
    { label: 'Delete', value: 'delete', icon: 'delete_outline', class: 'text-red', separator: true },
  ]
})

function onAction (action: Indexable) {
  switch (action.value) {
    case 'rename':
      editable.value = true
      name.value = props.item.name
      break
    case 'closeOther':
      break
    case 'closeToRight':
      break
    case 'reload':
      refresh()
      break
  }
}

function onBlur() {
  editable.value = false
  console.log('input', name.value)
  chatConversationService.save({
    id: props.item.id,
    name: name.value
  }).then(res => {
    emit('updated', res)
  })
}

function openConversation(item: ChatConversation) {
  emit('open', item)
}

function onToggleFavorite() {
  const favorite = props.item.favorite === 1 ? 0 : 1
  chatConversationService.save({
    id: props.item.id,
    favorite
  }).then(res => {
    emit('updated', res)
  })
}
</script>

<style lang="scss">
.chat-conversation-item {
  padding: 0 6px;
  min-height: 44px;
  .q-item__section--avatar {
    min-width: unset;
    padding-right: 2px;
  }

  &:hover, &.clicked {
    .more {
      display: flex;
    }
  }

  .more {
    display: none;
  }
}
</style>
