<template>
  <section class="o-query-section"
           :class="{'query-full-screen': fullScreen}">
    <o-console-section v-bind="props" @full-screen="onFullScreen">
      <template #header-left>
        <slot name="header-left"></slot>
      </template>
      <template #header-extension>
        <slot name="header-extension"></slot>
      </template>

      <template #extension>
        <slot name="extension"></slot>
      </template>

      <template #actions>
        <slot name="actions"></slot>
      </template>

      <template #query-table-actions>
        <template v-if="!disableActions">
          <q-btn icon="mdi-arrow-expand-vertical" flat>
            <q-menu class="o-menu">
              <div :style="{minWidth: '200px'}">
                <q-list no-border link inset-delimiter>
                  <o-common-item label="默认"
                                 :icon="denseTable?'radio_button_unchecked':'radio_button_checked'"
                                 @click="setDense(false)"
                                 clickable closable />
                  <o-common-item label="紧凑"
                                 :icon="denseTable?'radio_button_checked':'radio_button_unchecked'"
                                 @click="setDense(true)"
                                 clickable closable />
                </q-list>
              </div>
            </q-menu>
          </q-btn>
          <q-btn icon="refresh" flat @click="onQuery" />
          <q-btn icon="settings" flat>
            <q-menu class="o-menu">
              <div :style="{minWidth: '200px'}">
                <q-list no-border link inset-delimiter>
                  <o-common-item v-for="(item, index) of columns" :key="index"
                                 :label="item.label"
                                 :icon="columnIcon(item)"
                                 @click="toggleColumn(item)"
                                 clickable />
                </q-list>
              </div>
            </q-menu>
          </q-btn>
        </template>
      </template>

      <template #query-table-actions-start>
        <slot name="actions-start"></slot>
      </template>

      <template #query-table-actions-end>
        <slot name="actions-end"></slot>
      </template>

      <section class="query-wrap">
        <q-card flat class="query-condition-card desktop-only" v-if="showQueryAction">
          <q-card-section class="row justify-between items-center relative-position condition">
            <section class="row col q-col-gutter-sm">
              <slot name="condition"></slot>
            </section>
            <section class="row col-auto">
              <q-btn icon="search" label="查询" class="bg-primary text-white query-btn" @click="onQuery" flat />
              <q-btn icon="refresh" label="重置" color="primary" class="q-ml-sm reset-btn" @click="onReset" outline />
            </section>
          </q-card-section>
        </q-card>

        <q-separator class="bg-accent" />

        <q-card flat class="query-result-card" :class="{ 'show-query-action': showQueryAction }">
          <q-card-section class="row justify-around relative-position query-results"
                          :class="{'sticky-first-column': stickyFirst, 'sticky-last-column': stickyLast}">
            <slot name="results"></slot>
          </q-card-section>
        </q-card>
      </section>

      <template #side-panel>
        <slot name="side-panel"></slot>
      </template>
    </o-console-section>
  </section>
</template>

<script setup lang="ts">
import {onMounted, ref, watch} from 'vue';

import OConsoleSection from './OConsoleSection.vue';

const props = defineProps({
  extendHeader: {
    type: Boolean,
    default: false
  },
  icon: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: ''
  },
  showQueryAction: {
    type: Boolean,
    default: true
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
  visibleColumns: {
    type: Array,
    default () {
      return []
    }
  },
  columns: {
    type: Array,
    default () {
      return []
    }
  },
  stickyFirst: {
    type: Boolean,
    default: false
  },
  stickyLast: {
    type: Boolean,
    default: false
  },
  dense: {
    type: Boolean,
    default: false
  },
  docUrl: {
    type: String,
    default: ''
  },
  disableActions: {
    type: Boolean,
    default: false
  },
});
const emit = defineEmits(['fullScreen', 'query', 'reset', 'dense', 'visible']);

const fullScreen = ref(false);
const denseTable = ref(false);
const vcolumns = ref(false);

function onFullScreen (value) {
  fullScreen.value = value;
  emit('fullScreen', value);
}
function onQuery () {
  emit('query');
}
function onReset () {
  emit('reset');
}
function setDense (dense) {
  denseTable.value = dense;
  emit('dense', dense);
}
function columnIcon (item) {
  return vcolumns.value.indexOf(item.field) >= 0
      ? 'check_box'
      : 'check_box_outline_blank';
}

function toggleColumn (item) {
  const index = vcolumns.value.indexOf(item.field);
  if (index >= 0) {
    vcolumns.value.splice(index, 1);
  } else {
    vcolumns.value.push(item.field);
  }
  emit('visible', vcolumns.value);
}

watch(() => props.visibleColumns, (newValue) => {
  vcolumns.value = newValue;
})

onMounted(() => {
  denseTable.value = props.dense;
})
</script>

<style lang="scss">
.o-query-section {
  width: 100%;

  .console-header {
    border-bottom: solid 1px var(--q-accent);
    .console-toolbar {
      .o-icon {
        font-size: 1.6rem!important;
      }
      .toolbar-title {
        font-size: 1.2rem;
      }
    }
  }

  .console-content {
    padding: 0;

    .content {
      border-radius: 4px;
    }
  }


  .query-condition-card {
    border-radius: 2px 2px 0 0;
    //background: red;

    .condition {
      padding: 1rem 0;
    }

    .q-field--standout.q-field--focused .q-field__control {
      background: rgba(#000, 0.05) !important;
      box-shadow: unset !important;

      input, .q-field__suffix, .q-field__marginal, .q-field__native {
        color: #000;
      }
    }

    .q-btn {
      .q-icon {
        font-size: 1.4rem;
      }
    }

    .query-item {
      max-width: 360px;
      min-width: 120px;
      .q-select .q-field__input {
        min-width: 2px !important;
      }
    }
  }

  .query-result-card {
    border-radius: 0 0 2px 2px;
    .query-results {
      padding: 0;

      .q-table__card {
        box-shadow: none;

        .q-table {
          .q-btn--dense {
            font-size: 0.9rem;
            .q-btn__wrapper {
              padding: 2px 8px;
              min-height: unset !important;
            }
          }

          .q-chip {
            font-size: 0.7rem;
          }

          th {
            font-weight: 600;
          }
        }
      }

      &.sticky-first-column {
        th:first-child,
        td:first-child {
          position: sticky;
          left: 0;
          background-color: var(--q-secondary);
          //box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
          z-index: 1;
        }
      }

      &.sticky-last-column {
        th:last-child,
        td:last-child {
          position: sticky;
          right: 0;
          background-color: var(--q-secondary);
          box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
          z-index: 1;
        }
      }
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
}

body.body--dark .o-query-section {
  .query-condition-card {
    .q-field--standout.q-field--focused .q-field__control {
      background: rgba(#fff, 0.05) !important;

      input, .q-field__suffix, .q-field__marginal, .q-field__native {
        color: #fff;
      }
    }
  }
}

.query-full-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 300;

  .o-page-container {
    padding: 0 !important;
  }
}

.mobile {
  .o-query-section {
    .query-wrap {
      max-width: 100vw;
      padding: 0;
    }
    .query-header-card {
      .query-toolbar {
        padding: 14px;
      }
      .header-extension {
        padding: 0 14px 14px 14px;
      }
    }
  }

}
</style>
