<template>
  <section class="row items-center text-tips note-actions">
    <div>
      {{ timeMulti(currentNote.updateTime || '').fromNow() }}
    </div>
    <q-btn :icon="currentNote.favorite === 1 ? 'star' : 'star_outline'"
           flat
           @click="toggleFavorite(currentNote)" />
    <q-btn icon="o_share"
           flat
           @click="shareNote(currentNote)" v-if="ipcProvider === 'web'" />
    <q-btn icon="more_horiz" flat>
      <q-menu ref="menu"
              anchor="bottom right"
              self="top right"
              :offset="[0, 4]"
              transition-show="jump-down"
              class="o-note-action-menu pi-menu dense">
        <section style="min-width: 260px;">
          <header class="row col-12 q-col-gutter-x-xs">
            <div class="col-4">
              <q-btn class="full-width" :class="{ 'active': styles.font === 'default' }"
                     stack flat @click="onFont('default')">
                <div>Ag</div>
                <div class="text-tips font">{{ $t('note.style.defaultFont') }}</div>
              </q-btn>
            </div>
            <div class="col-4">
              <q-btn class="full-width" :class="{ 'active': styles.font === 'serif' }"
                     stack flat @click="onFont('serif')">
                <div class="serif">Ag</div>
                <div class="text-tips font">{{ $t('note.style.serifFont') }}</div>
              </q-btn>
            </div>
            <div class="col-4">
              <q-btn class="full-width" :class="{ 'active': styles.font === 'mono' }"
                     stack flat @click="onFont('mono')">
                <div class="mono">Ag</div>
                <div class="text-tips font">{{ $t('note.style.monoFont') }}</div>
              </q-btn>
            </div>
          </header>
          <q-list :style="{minWidth: '240px'}">
            <template v-for="(action, index) in actions" :key="`action-${index}`">
              <q-separator class="bg-accent" v-if="action.separator" />
              <o-common-item v-bind="action"
                             @click="onAction(action, '')"
                             v-if="!action.hidden"
                             closable>
                <template #side>
                  <q-toggle v-model="styles.fullWidth"
                            @update:model-value="onAction(action, $event)"
                            v-if="action.value === 'fullWidth'" />
                  <q-toggle v-model="styles.toc"
                            @update:model-value="onAction(action, $event)"
                            v-if="action.value === 'toc'" />
                  <q-toggle v-model="styles.smallText"
                            @update:model-value="onAction(action, $event)"
                            v-if="action.value === 'smallText'" />
                  <q-toggle v-model="styles.autoNumbering"
                            @update:model-value="onAction(action, $event)"
                            v-if="action.value === 'autoNumbering'" />
                </template>
              </o-common-item>
            </template>
          </q-list>
        </section>
      </q-menu>
    </q-btn>
    <q-btn flat
           @click="emit('action', { value: 'split' })"
           v-permission="['owner', 'admin', 'editor']">
      <o-icon name="icon-sidebar-right" size="20px" />
    </q-btn>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, type PropType, ref } from 'vue'
import useNote from 'src/hooks/useNote'
import { timeMulti } from 'core/utils/dayjs'
import useCommon from 'core/hooks/useCommon'
import useDialog from 'core/hooks/useDialog'
import * as Y from 'yjs'
import { ipcProvider } from 'src/api/ipc'

const props = defineProps({
  ydoc: {
    type: Object as PropType<Y.Doc>,
    default: () => {}
  },
})
const emit = defineEmits(['action', 'restore'])

const { t } = useCommon()
const { openDialog } = useDialog()
const {
  currentNote,
  saveNote,
  beforeDeleteNote,
  toggleFavorite,
  shareNote,
  duplicateNote,
  newTab,
  newWindow,
  canEdit,
  canAdmin
} = useNote()

const styles = ref<Indexable>({
  font: 'default',
  fullWidth: false,
  toc: true,
  smallText: false,
  autoNumbering: false,
})

const actions = computed(() => {
  return [
    {
      label: t('note.style.fullWidth'),
      value: "fullWidth",
      icon: "mdi-arrow-expand",
      iconClass: "rotate-45",
      rightSide: true,
    },
    {
      label: t('note.style.toc'),
      value: "toc",
      icon: "toc",
      rightSide: true
    },
    {
      label: t('note.style.smallText'),
      value: "smallText",
      icon: "mdi-format-font-size-decrease",
      rightSide: true,
      separator: true
    },
    {
      label: t('note.style.autoNumbering'),
      value: "autoNumbering",
      icon: "format_list_numbered",
      rightSide: true,
    },
    {
      label: t('note.duplicate'),
      value: "duplicate",
      icon: "copy_all",
      // sideLabel: "⌘D",
      clickable: true,
      separator: canEdit(currentNote.value),
      hidden: !canEdit(currentNote.value)
    },
    // {
    //   label: t('note.moveTo'),
    //   value: "moveTo",
    //   icon: "keyboard_return",
    //   iconClass: "rotate-180",
    //   clickable: true,
    //   sideLabel: "⌘⇧P",
    // },
    {
      label: t('delete'),
      value: "delete",
      icon: "delete_outline",
      class: 'text-red',
      clickable: true,
      hidden: !canAdmin(currentNote.value)
    },
    {
      label: t('import'),
      value: "import",
      icon: "mdi-arrow-collapse-up",
      clickable: true,
      separator: true,
      hidden: !canEdit(currentNote.value)
    },
    {
      label: t('export'),
      value: "export",
      icon: "mdi-arrow-collapse-down",
      clickable: true,
    },
    {
      label: t('note.version'),
      value: "version",
      icon: "o_web_stories",
      clickable: true,
      separator: canEdit(currentNote.value),
      hidden: !canEdit(currentNote.value)
    },
    {
      label: t('note.newTab'),
      value: "newTab",
      icon: "open_in_new",
      sideLabel: "⌘⇧",
      clickable: true,
      separator: true,
    },
    {
      label: t('note.newWindow'),
      value: "newWindow",
      icon: "open_in_browser",
      clickable: true,
    },
  ]
})

function onAction (action: Indexable, value: any) {
  const data = currentNote.value
  switch (action.value) {
    case 'duplicate':
      duplicateNote(data)
      break
    case 'delete':
      beforeDeleteNote(data)
      break
    case 'newTab':
      newTab(data)
      break
    case 'newWindow':
      newWindow(data)
      break
    case 'version':
      openDialog({
        type: 'note-history',
        ydoc: props.ydoc,
        onOk: (version: Indexable) => {
          emit('restore', version)
        }
      })
      break
    case 'fullWidth':
    case 'toc':
    case 'smallText':
    case 'autoNumbering':
      onStyles()
      emit('action', { ...action, actionValue: value })
      break
    default:
      emit('action', action)
      break
  }
}

function onStyles() {
  saveNote({
    id: currentNote.value.id,
    styles: styles.value
  })
}

function onFont(value: string) {
  styles.value.font = value
  onStyles()
}

function loadStyle() {
  styles.value = currentNote.value.styles || {
    font: 'default',
    smallText: false,
    fullWidth: false,
    toc: true,
    autoNumbering: false,
  }
}

onMounted(() => {
  loadStyle()
})
</script>

<style lang="scss">
.note-actions {
  .q-btn {
    width: 32px !important;
    height: 32px !important;
    min-height: 32px;
    min-width: 32px;
    border-radius: 4px;
    margin-left: 8px;
    padding: 0;
  }
}

.o-note-action-menu {
  header {
    padding: 8px 8px 0 8px;
    .q-btn {
      border-radius: 4px;
      font-size: 1.6rem;

      &.active {
        color: var(--q-primary) !important;
        background: var(--q-accent) !important;
      }

      .serif {
        font-family: Lyon-Text, Georgia, "Songti SC", SimSun, serif;
      }

      .mono {
        font-family: iawriter-mono, Nitti, Menlo, Courier, monospace;
      }

      .font {
        font-size: 0.8rem;
        font-weight: normal;
        line-height: 1;
      }
    }
  }
}
</style>
