<template>
  <o-common-section class="o-console-section"
                    :scrollable="fullScreen"
                    :side="side"
                    :side-full-screen="sideFullScreen"
                    @update:side="onSideShow"
                    @side-close="onSideClose"
                    @side-confirm="onSideConfirm">
    <!--Header-->
    <header class="console-header"
            :class="{'full': fullScreen, 'fixed-header': fixedHeader && !fullScreen}">
      <section class="row col-12 justify-between text-info console-toolbar">
        <div class="row items-center meta">
          <div class="row items-center" v-if="!disableMeta">
            <o-icon :name="icon || (menu.icon ? menu.icon : 'apps')" size="2rem" />
            <div class="row items-center toolbar-title">
              {{ title || menuLabel(menu.name) }}
            </div>
          </div>
          <slot name="header-left"></slot>
        </div>
        <q-space class="drag-region" v-if="fullScreen" />
        <div class="row items-center toolbar-right no-drag-region">
          <div class="row items-center actions">
            <slot name="actions"></slot>
          </div>
          <div class="q-px-sm" v-if="!disableActions && false">
            <q-separator class="bg-accent" vertical />
          </div>
          <div class="row items-center query-table-actions" v-if="!disableActions">
            <slot name="query-table-actions-start"></slot>
            <slot name="query-table-actions"></slot>
          </div>

          <template v-if="!disableActions">
            <q-btn icon="help_outline"
                   round flat
                   @click="openPath(docUrl)"
                   v-if="docUrl">
              <o-tooltip :message="$t('help')" />
            </q-btn>
            <q-btn :icon="fullScreen ? 'mdi-arrow-collapse-all' : 'mdi-arrow-expand-all'"
                   class="btn-fullscreen desktop-only"
                   flat round
                   @click="toggleFullScreen" v-if="enableFullscreen" />
            <slot name="query-table-actions-end"></slot>
          </template>
          <o-tool-bar-overlay v-if="fullScreen" />
        </div>
      </section>
      <section class="col-12 header-extension" v-if="extendHeader">
        <slot name="header-extension"></slot>
      </section>
    </header>

    <!--Content-->
    <section class="console-content" :class="{'fixed-header': fixedHeader && !fullScreen}">
      <template v-if="expand && !extensionOnly">
        <q-card :class="contentClass" flat>
          <q-card-section class="row col-12 content"
                          :class="{'padding': contentPadding}">
            <section class="col-12">
              <slot></slot>
            </section>
          </q-card-section>
        </q-card>
      </template>

      <section class="extension" :class="{'only': extensionOnly}">
        <slot name="extension"></slot>
      </section>
    </section>

    <!--Footer-->
    <footer>
      <slot name="footer"></slot>
    </footer>

    <template #side-panel>
      <slot name="side-panel"></slot>
    </template>
  </o-common-section>
</template>

<script setup lang="ts">
import {computed, onActivated, onMounted, ref, watch} from 'vue'
import { useRoute } from 'vue-router'

import OCommonSection from './OCommonSection.vue'
import OIcon from 'core/components/icon/OIcon.vue'

import { toggleClass } from 'core/utils/misc'
import { MenuItem } from 'core/types/menu'
import { findMenuByPath, menuLabel } from 'core/hooks/useMenu'
import { openPath } from 'core/hooks/useRouter'
import { useNaviStore } from 'stores/navi.setup'
import OToolBarOverlay from 'core/components/electron/OToolBarOverlay.vue'

const props = defineProps({
  icon: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: ''
  },
  extendHeader: {
    type: Boolean,
    default: false
  },
  fixedHeader: {
    type: Boolean,
    default: false
  },
  extensionOnly: {
    type: Boolean,
    default: false
  },
  disableMeta: {
    type: Boolean,
    default: false
  },
  disableActions: {
    type: Boolean,
    default: false
  },
  enableFullscreen: {
    type: Boolean,
    default: false
  },
  contentClass: {
    type: String,
    default: ''
  },
  contentPadding: {
    type: Boolean,
    default: false
  },
  docUrl: {
    type: String,
    default: ''
  },
  side: {
    type: Object,
    default: function () {
      return {
        show: false,
        title: '',
        style: {width: '375px'},
        action: false
      }
    }
  },
  sideFullScreen: {
    type: Boolean,
    default: false
  },
})

const emit = defineEmits(['fullScreen', 'update:side', 'sideClose', 'sideConfirm'])

const route = useRoute()
const naviStore = useNaviStore()
const fullScreen = ref(false)
const expand = ref(true)

const menu = computed(() => naviStore.currentMenu)

function updateMenu () {
  naviStore.updateMenu(route)
}

function toggleFullScreen () {
  fullScreen.value = !fullScreen.value
  toggleClass(document.body, 'full-screen-page')
  emit('fullScreen', fullScreen.value)
}

function onSideShow () {
  const side = props.side
  side.show = true
  emit('update:side', side)
}

function onSideClose () {
  const side = props.side
  side.show = false
  emit('update:side', side)
  emit('sideClose')
}

function onSideConfirm () {
  emit('sideConfirm')
}

watch(
  () => naviStore.menus,
  (newValue) => {
    updateMenu()
  }
)


onActivated(() => {
  // updateMenu();
})
</script>

<style lang="scss">
.o-console-section {
  .console-header {
    .console-toolbar {
      padding: 21px 21px 0 21px;
      .back {
        .q-btn {
          .q-icon {
            font-size: 1.5rem;
          }
        }
      }

      .meta {
        .q-btn {
          width: 40px;
          height: 40px;
          margin-right: 10px;
        }
      }

      .q-separator {
        height: 20px;
      }

      .q-btn {
        padding: 4px 12px;

        .q-icon {
          font-size: 1.4rem;
          font-weight: 200;
        }

        &--dense {
          height: 32px;
        }

        &--round {
          border-radius: 6px;
        }
      }

      .o-icon {
        font-size: 2rem;
      }

      .toolbar-title {
        font-size: 1.6rem;
        font-weight: bold;
        padding-left : 8px;
      }

    }

    &.fixed-header {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 2;
      background: linear-gradient(to right,
        var(--q-secondary) 30%,
        transparent 50%,
        var(--q-secondary) 70%);
    }
  }

  .console-content {
    padding: 21px;

    &.fixed-header {
      padding-top: 84px;
    }

    &:has(.no-padding) {
      padding: 0!important;
    }

    .content {
      padding: 0;

      &.padding {
        padding: 1rem;
      }
    }

    .extension:has(div, section) {
      margin-top: 21px;
    }

    .extension.only {
      margin-top: 0 !important;
    }
  }

  &.tabs {
    .header-extension {
      padding: 6px 21px 0 21px;
    }

    .q-tab {
      border-radius: 0;
      &:hover {
        background: transparent;
      }
    }

    .q-tab--active:before {
      background: transparent;
    }
  }

  &.page-full-screen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 2002;
  }

  .o-console-section {
    width: 100%;
    .console-header {
      .console-toolbar {
        .toolbar-title {
          font-size: 1.2rem !important;
        }
      }
      border-bottom: solid 1px var(--q-accent);
    }

    .console-content {
      padding: 0;
    }
  }
}

.full-screen-page {
  .o-console-section {
    .console-header.full .console-toolbar {
      background: var(--q-accent);
      padding: 0 !important;
      position: fixed;
      left: 0;
      right: 0;
      z-index: 100;

      .q-btn, .q-field {
        border-radius: 0;
        min-height: 40px;
      }
      .q-field__control {
        border-radius: 0;
      }
      .meta {
        .o-icon {
          font-size: 1.5rem !important;
        }
        .toolbar-title {
          font-size: 1.1rem;
        }
      }
    }

    .header-extension {
      padding: 0;
    }

    .console-content {
      margin-top: 42px;
      .console-content {
        margin-top: 0;
      }
    }
  }
}
</style>
