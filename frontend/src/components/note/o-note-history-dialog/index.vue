<template>
  <q-dialog ref="modal"
            :seamless="seamless"
            @show="$emit('show')"
            @hide="onHide"
            position="standard"
            :class="`o-note-history-dialog`" :maximized="isMaximized">
    <q-layout view="lhh LpR lff" container :style="style"
              class="bg-secondary">
      <q-splitter v-model="splitterModel"
                  :limits="[200, 480]"
                  unit="px"
                  class="fit" reverse>
        <template v-slot:before>
          <q-page-container>
            <q-page class="bg-secondary">
              <q-scroll-area ref="scrollRef" class="o-scroll-wrapper">
                <version-viewer :version="version" :ydoc="ydoc" v-if="version.id" />
              </q-scroll-area>
            </q-page>
          </q-page-container>
        </template>

        <template v-slot:after>
          <header class="text-info">
            <q-toolbar>
              <q-toolbar-title class="text-bold">
                {{$t('note.version')}}
              </q-toolbar-title>
              <section class="text-tips actions no-drag-region">
                <q-btn flat round dense @click="onMinimized">
                  <o-icon :name="isMaximized ? 'icon-fluent-restore' : 'icon-fluent-maximize'" size="10px" />
                </q-btn>
                <q-btn flat round dense v-close-popup>
                  <o-icon name="icon-fluent-close" size="10px" />
                </q-btn>
              </section>
            </q-toolbar>
            <q-separator class="bg-accent" />
          </header>
          <nav class="">
            <q-scroll-area class="o-scroll-wrapper">
              <q-list v-if="versions.length">
                <template v-for="(item, index) in versions" :key="index">
                  <o-common-item :icon="item.icon || 'history'"
                                 lines="2"
                                 :active="item.id === version.id"
                                 @click="onViewVersion(item)"
                                 clickable>
                    <template #label>
                      <q-item-label>
                        {{item.title}}
                      </q-item-label>
                      <q-item-label caption>
                        {{ timeMulti(item.updateTime).timestamp() }}
                        <o-badge dense>{{ item.userName }}</o-badge>
                      </q-item-label>
                    </template>
                  </o-common-item>
                </template>
              </q-list>
              <o-no-data :message="$t('query.noRecords')" image v-else />
            </q-scroll-area>
          </nav>
          <footer>
            <q-separator class="bg-accent" />
            <q-toolbar>
              <div class="text-tips">
                <q-btn icon="o_help" round flat />
              </div>
              <q-space />
              <section class="text-tips actions no-drag-region">
                <q-btn :label="$t('restore')"
                       class="bg-primary text-white"
                       flat
                       :disable="versions.length === 0"
                       @click="onRestore" />
              </section>
            </q-toolbar>
          </footer>
        </template>
      </q-splitter>
    </q-layout>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed, onMounted, provide, ref, shallowRef, useTemplateRef, watch } from 'vue'
import useDialog from 'core/hooks/useDialog'
import useCommon from 'core/hooks/useCommon'

import { QScrollArea, useQuasar } from 'quasar'
import VersionViewer from './viewer.vue'
import useNote from 'src/hooks/useNote'
import { noteVersionService } from 'src/api/service/remote/note-version'
import { timeMulti } from 'core/utils/dayjs'

const scrollRef = useTemplateRef<QScrollArea>('scrollRef')

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  seamless: {
    type: Boolean,
    default: false
  },
  scrollable: {
    type: Boolean,
    default: false
  },
})
const emit = defineEmits(['show'])

const $q = useQuasar()
const { t, confirm } = useCommon()
const { dialog, onHide, onOk } = useDialog()

const { currentNote } = useNote()
const modal = ref()
const splitterModel = ref(360)
const isMaximized = ref(false)
const versions = ref<Indexable[]>([])
const version = ref<Indexable>({})

const style = computed(() => {
  return isMaximized.value
    ? {
      height: '100vh',
      width: '100vw',
    }
    : {
      height: '90vh',
      maxHeight: '90vh',
      width: '90vw',
      maxWidth: '1555px',
    }
})

const type = computed(() => dialog.value.type)
const ydoc = computed(() => dialog.value.ydoc)

function onMinimized() {
  isMaximized.value = !isMaximized.value
}

function scrollToBottom(duration = 0) {
  const scrollTarget = scrollRef.value?.getScrollTarget()
  const scrollHeight = scrollTarget?.scrollHeight || 0
  scrollRef.value?.setScrollPosition('vertical', scrollHeight, duration)
}

function getVersions() {
  const body = {
    pageSize: 100,
    condition: {
      noteId: currentNote.value.id
    },
    sort: {
      updateTime: 'desc'
    }
  }
  noteVersionService.queryDetails(body).then(res => {
    versions.value = res.list
    if (res.list.length > 0) {
      version.value = res.list[0]
    }
  })
}

function onViewVersion(item: Indexable) {
  version.value = item
}

function onRestore() {
  $q.dialog({
    class: 'pi-dialog-theme',
    title: `${t('note.versions.restore')}`,
    message: `${t('note.versions.restoreTips')} <div class="tag blue">${version.value.title}</div>`,
    html: true,
    cancel: true
  }).onOk( () => {
    onOk(version.value)
  })
}

watch(() => type.value, (newValue) => {
  if (newValue === 'note-history') {
    modal.value.show()
  } else {
    modal.value.hide()
  }
})

onMounted(() => {
  if (type.value === 'note-history') {
    modal.value.show()

    getVersions()
  }
})

provide('scrollToBottom', scrollToBottom)
</script>

<style lang="scss">
.o-note-history-dialog {

  nav {
    position: relative;
    height: calc(90vh - 110px);

    .q-list {
      padding: 0 8px;

      .q-item {
        padding: 0 8px 0 0;
        border-radius: 4px;
        margin-top: 8px;
        min-height: 54px;

        &:not(:first-child) {
          margin-top: 4px;
        }

        &__label {
          margin-top: 0;
        }
      }
    }
  }


  .q-toolbar {
    min-height: 54px;

    .q-toolbar__title {
      font-size: 1.4rem;
    }

    .q-icon {
      font-size: 1.2rem;
    }

    .actions {
      .q-btn {
        border-radius: 4px !important;
      }
    }
  }

  footer {

    .actions {
      .q-btn {
        min-width: 100px;
      }
    }
  }

  .q-dialog__inner--maximized {
    nav {
      height: calc(100vh - 110px);
    }
  }
}
</style>
