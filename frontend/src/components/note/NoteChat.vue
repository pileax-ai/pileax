<template>
  <q-layout view="lHh lpr lFf" container class="bg-secondary note-chat">
    <q-header class="bg-secondary text-info header">
      <q-toolbar>
        <q-toolbar-title class="text-bold">
          <q-icon name="mdi-creation" />
        </q-toolbar-title>
        <o-chat-toc ref="tocRef" :chats="chats" :mini-view="false">
          <template #trigger>
            <q-btn icon="toc" flat round dense />
          </template>
        </o-chat-toc>
        <q-btn icon="delete_sweep" flat round dense />
        <q-btn icon="close" flat round dense @click="emit('close')" />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-page class="bg-secondary">
        <chat-section ref="chatSection"
                      ref-type="note"
                      :ref-id="noteId"
                      :description="$t('ai.basedOnNote')"
                      :tag="$t('ai.basedOnNote')"
                      dense note
                      @chats="onChats">
          <template #menu>
            <template v-for="(item, index) in actions" :key="index">
              <q-separator class="bg-accent" v-if="item.separator" />
              <o-common-item v-bind="item"
                             :closable="!item.sideIcon"
                             clickable>
                <o-menu class="pi-menu"
                        anchor="top left"
                        self="bottom left"
                        :offset="[0, 4]"
                        :min-width="`${chatWidth - 36}px`"
                        v-if="item.value === 'translate'">
                  <template v-for="(item, index) in Languages" :key="index">
                    <o-common-item v-bind="item"
                                   closable
                                   clickable
                                   @click="onTranslate(item)" />
                  </template>
                </o-menu>
              </o-common-item>
            </template>
          </template>
        </chat-section>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import ChatSection from 'components/chat/ChatSection.vue'
import { computed, ref } from 'vue'
import OChatToc from 'components/chat/OChatToc.vue'
import useNote from 'src/hooks/useNote'
import { Languages } from 'core/constants/metadata'

const props = defineProps({
  noteId: {
    type: String,
    default: ''
  },
})
const emit = defineEmits(['close'])

const chatSection = ref<InstanceType<typeof ChatSection>>()
const { noteStore } = useNote()
const chats = ref<Indexable[]>([])

const chatWidth = computed(() => (noteStore.value.chatWidth))

const actions = computed(() => {
  return [
    { label: 'Summary', value: 'summary', icon: 'text_snippet' },
    { label: 'Translate to', value: 'translate', icon: 'translate', sideIcon: 'chevron_right' }
  ]
})

const onTranslate = (lang: Indexable) => {
  console.log('translate to', lang.subLabel)
  chatSection.value?.send(`Translate to ${lang.subLabel}`)
}

const onChats = (value: Indexable[]) => {
  console.log('chats', value)
  chats.value = value
}
</script>

<style lang="scss">
.note-chat {
  height: calc(100vh - 40px);

  .q-toolbar {
    min-height: 40px;
    .q-toolbar__title {
      font-size: 1rem;
    }

    .q-icon {
      font-size: 1.2rem;
    }
    border-bottom: solid 1px var(--q-accent);
  }
}
</style>
