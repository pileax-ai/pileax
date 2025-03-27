<template>
  <o-common-page class="o-query-page"
                 :class="{'page-full-screen': fullScreen}"
                 scrollable>
    <o-query-section v-bind="props"
                     @full-screen="onFullScreen"
                     @dense="$emit('dense')"
                     @query="$emit('query')"
                     @reset="$emit('reset')">
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

      <template #actions-start>
        <slot name="actions-start"></slot>
      </template>

      <template #actions-end>
        <slot name="actions-end"></slot>
      </template>

      <template #condition>
        <slot name="condition"></slot>
      </template>

      <template #results>
        <slot name="results"></slot>
      </template>

      <template #side-panel>
        <slot name="side-panel"></slot>
      </template>
    </o-query-section>
  </o-common-page>
</template>

<script setup lang="ts">
import {onMounted, ref, watch} from 'vue';

import OCommonPage from 'core/page/template/OCommonPage.vue';
import OQuerySection from '../section/OQuerySection.vue';

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
    default: true
  },
  stickyLast: {
    type: Boolean,
    default: true
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
const emit = defineEmits(['query', 'reset', 'dense', 'visible']);

const fullScreen = ref(false);
const denseTable = ref(false);
const vcolumns = ref(false);

function onFullScreen (value) {
  fullScreen.value = value;
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
.o-query-page {

  .o-query-section {
    width: 100%;

    .console-header {
      border-bottom: none;

      .console-toolbar {
        .o-icon {
          font-size: 2rem !important;
        }

        .toolbar-title {
          font-size: 1.6rem;
        }
      }

      .header-extension {
        padding: 0 21px 16px 21px;
      }
    }

    .console-content {
      padding: 21px;
    }
  }


  &.tabs {
    .o-query-section {
      .header-extension {
        padding: 0 21px;
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
}
</style>
