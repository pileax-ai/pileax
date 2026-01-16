<template>
  <section class="row items-center text-tips note-actions">
    <div>
      {{ timeMulti(currentNote.updateTime || '').fromNow() }}
    </div>
    <q-btn :icon="currentNote.favorite === 1 ? 'star' : 'star_outline'"
           flat
           @click="toggleFavorite(currentNote)" />
    <q-btn icon="more_horiz" flat>
      <q-menu ref="menu"
              anchor="bottom right"
              self="top right"
              :offset="[0, 4]"
              transition-show="jump-down"
              class="o-note-action-menu pi-menu dense">
        <section style="min-width: 260px;">
          <header class="row col-12 justify-around">
            <q-btn class="col-4" :class="{ 'active': styles.font === 'default' }"
                   stack flat @click="onFont('default')">
              <div>Ag</div>
              <div class="text-tips font">{{ $t('note.style.defaultFont') }}</div>
            </q-btn>
            <q-btn class="col-4" :class="{ 'active': styles.font === 'serif' }"
                   stack flat @click="onFont('serif')">
              <div class="serif">Ag</div>
              <div class="text-tips font">{{ $t('note.style.serifFont') }}</div>
            </q-btn>
            <q-btn class="col-4" :class="{ 'active': styles.font === 'mono' }"
                   stack flat @click="onFont('mono')">
              <div class="mono">Ag</div>
              <div class="text-tips font">{{ $t('note.style.monoFont') }}</div>
            </q-btn>
          </header>
          <q-list :style="{minWidth: '240px'}">
            <template v-for="(action, index) in actions" :key="`action-${index}`">
              <q-separator class="bg-accent" v-if="action.separator" />
              <o-common-item v-bind="action"
                             @click="onAction(action, '')"
                             closable>
                <template #side>
                  <q-toggle v-model="styles.smallText"
                            @update:model-value="onAction(action, $event)"
                            v-if="action.value === 'smallText'" />
                  <q-toggle v-model="styles.fullWidth"
                            @update:model-value="onAction(action, $event)"
                            v-if="action.value === 'fullWidth'" />
                  <q-toggle v-model="styles.toc"
                            @update:model-value="onAction(action, $event)"
                            v-if="action.value === 'toc'" />
                </template>
              </o-common-item>
            </template>
          </q-list>
        </section>
      </q-menu>
    </q-btn>
    <q-btn flat
           @click="emit('action', { value: 'split' })">
      <o-icon name="icon-sidebar-right" size="20px" />
    </q-btn>
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, ref } from 'vue'
import useNote from 'src/hooks/useNote'
import { timeMulti } from 'core/utils/dayjs'
import useCommon from 'core/hooks/useCommon'

const emit = defineEmits(['action'])

const { t } = useCommon()
const {
  currentNote,
  saveNote,
  beforeDeleteNote,
  toggleFavorite,
  duplicateNote,
  newTab,
  newWindow,
} = useNote()

const styles = ref({
  font: 'default',
  smallText: false,
  fullWidth: false,
  toc: true,
})

const actions = computed(() => {
  return [
    {
      label: t('note.style.smallText'),
      value: "smallText",
      icon: "mdi-format-font-size-decrease",
      rightSide: true,
    },
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
      label: t('note.duplicate'),
      value: "duplicate",
      icon: "copy_all",
      // sideLabel: "⌘D",
      clickable: true,
      separator: true,
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
      clickable: true,
    },
    {
      label: t('import'),
      value: "import",
      icon: "mdi-arrow-collapse-up",
      clickable: true,
      separator: true,
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
      separator: true,
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
    case 'smallText':
    case 'fullWidth':
    case 'toc':
      onStyles()
      emit('action', { ...action, actionValue: value })
      break
  }
}

function onStyles() {
  console.log('style', styles.value)
  saveNote({
    id: currentNote.value.id,
    styles: JSON.stringify(styles.value)
  })
}

function onFont(value: string) {
  styles.value.font = value
  onStyles()
}

onBeforeMount(() => {
  try {
    styles.value = JSON.parse(currentNote.value.styles || '')
  } catch (err) {
    // console.warn(err);
  }
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
        color: var(--q-primary);
        background: var(--q-accent);
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
