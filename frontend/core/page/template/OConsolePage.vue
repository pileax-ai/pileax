<template>
  <o-common-page class="o-console-page"
                 :class="{'page-full-screen': fullScreen}"
                 scrollable>
    <o-console-section v-bind="props" @full-screen="onFullScreen">
      <template #header-left>
        <slot name="header-left"></slot>
      </template>
      <template #header-extension>
        <slot name="header-extension"></slot>
      </template>
      <template #actions>
        <slot name="actions"></slot>
      </template>
      <template #extension>
        <slot name="extension"></slot>
      </template>
      <slot></slot>

      <template #side-panel>
        <slot name="side-panel"></slot>
      </template>
    </o-console-section>
  </o-common-page>
</template>

<script setup lang="ts">
import {computed, onActivated, onMounted, ref, watch} from 'vue';

import OCommonPage from 'core/page/template/OCommonPage.vue';
import OConsoleSection from '../section/OConsoleSection.vue';

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
  extensionOnly: {
    type: Boolean,
    default: false
  },
  disableMeta: {
    type: Boolean,
    default: false
  },
  enableFullscreen: {
    type: Boolean,
    default: false
  },
  contentClass: {
    type: String,
    default: 'bg-secondary'
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
});

const emit = defineEmits(['update:side', 'sideClose', 'sideConfirm']);

const fullScreen = ref(false);

function onFullScreen (value) {
  fullScreen.value = value;
}

function onSideShow () {
  let side = props.side;
  side.show = true;
  emit('update:side', side);
}

function onSideClose () {
  let side = props.side;
  side.show = false;
  emit('update:side', side);
  emit('sideClose');
}

function onSideConfirm () {
  emit('sideConfirm')
}

</script>

<style lang="scss">
.o-console-page {
  &.tabs {
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

    .q-tab-panel {
      padding: 0;
    }
  }

  .header-extension {
    padding: 0 21px 16px 21px;
  }
}

.page-full-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2002;
}

.mobile {
  .o-console-page {
    .console-header {
      .console-toolbar {
        padding: 0 14px;
      }
      .extension {
        padding: 0 14px 14px 14px;
      }
    }
    .console-content {
      padding: 14px;
    }
  }
}
</style>
