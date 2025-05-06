<template>
  <section class="row items-center text-tips note-actions">
    <div>
      {{ timeMulti(currentNote.updateTime || '').fromNow }}
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
        <header class="row col-12 justify-around">
          <q-btn class="col-4" :class="{ 'active': font === 'default' }"
                 stack flat @click="onFont('default')">
            <div>Ag</div>
            <div class="text-tips font">Default</div>
          </q-btn>
          <q-btn class="col-4" :class="{ 'active': font === 'serif' }"
                 stack flat @click="onFont('serif')">
            <div class="serif">Ag</div>
            <div class="text-tips font">Serif</div>
          </q-btn>
          <q-btn class="col-4" :class="{ 'active': font === 'mono' }"
                 stack flat @click="onFont('mono')">
            <div class="mono">Ag</div>
            <div class="text-tips font">Mono</div>
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
      </q-menu>
    </q-btn>
    <q-btn icon="vertical_split" flat
           @click="emit('action', { value: 'split' })" />
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, ref } from 'vue'
import useNote from 'src/hooks/useNote';
import { timeMulti } from 'core/utils/format';

const emit = defineEmits(['action']);

const {
  currentNote,
  saveNote,
  toggleFavorite
} = useNote();

const styles = ref({
  font: 'default',
  smallText: false,
  fullWidth: false,
  toc: true,
});
const font = ref('default');

const actions = computed(() => {
  return [
    {
      label: "Small text",
      value: "smallText",
      icon: "text_decrease",
      rightSide: true,
    },
    {
      label: "Full width",
      value: "fullWidth",
      icon: "open_in_full",
      iconClass: "rotate-45",
      rightSide: true,
    },
    { label: "Table of contents", value: "toc", icon: "toc", rightSide: true },
    {
      label: "Duplicate",
      value: "duplicate",
      icon: "copy_all",
      sideLabel: "⌘D",
      clickable: true,
      separator: true,
    },
    {
      label: "Move to",
      value: "move",
      icon: "keyboard_return",
      iconClass: "rotate-180",
      clickable: true,
      sideLabel: "⌘⇧P",
    },
    {
      label: "Delete",
      value: "delete",
      icon: "delete_outline",
      clickable: true,
    },
    {
      label: "Import",
      value: "delete",
      icon: "vertical_align_top",
      sideLabel: "⌘⇧",
      clickable: true,
      separator: true,
    },
    {
      label: "Export",
      value: "delete",
      icon: "vertical_align_bottom",
      clickable: true,
    },
    {
      label: "Open in new tab",
      value: "delete",
      icon: "open_in_new",
      sideLabel: "⌘⇧",
      clickable: true,
      separator: true,
    },
    {
      label: "Open in new window",
      value: "delete",
      icon: "open_in_browser",
      clickable: true,
    },
  ];
});

function onAction (action: Indexable, value: any) {
  switch (action.value) {
    case 'close':
      break;
    case 'closeOther':
      break;
    case 'closeToRight':
      break;
    case 'smallText':
    case 'fullWidth':
    case 'toc':
      onStyles();
      emit('action', { ...action, actionValue: value })
      break;
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
  font.value = value;
}

onBeforeMount(() => {
  try {
    styles.value = JSON.parse(currentNote.value.styles || '');
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
      }

      .serif {
        font-family: serif;
      }

      .mono {
        font-family: monospace;
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
