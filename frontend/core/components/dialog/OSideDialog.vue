<template>
  <q-dialog ref="modal"
            :maximized="maximized"
            :seamless="seamless"
            @before-show="onBeforeShow"
            @show="$emit('show')"
            @hide="$emit('close')"
            :position="fullScreen ? 'standard' : positionAlt"
            :class="`o-side-dialog ${contentClass} ${view}`">
    <q-card :style="styles" class="bg-white dialog-card" v-if="positionAlt==='standard'">
      <q-card-section class="bg-deep text-info header no-drag-region" v-if="!printing">
        <q-toolbar>
          <q-toolbar-title class="text-bold">
            <q-icon :name="icon" v-if="icon" />
            {{title}}
          </q-toolbar-title>
          <q-btn flat round dense icon="print" @click="onPrint" v-if="printable" />
          <q-btn flat round dense :icon="viewIcon" @click="onToggleView" v-if="toggleView" />
          <q-btn flat round dense :icon="positionIcon" @click="onTogglePosition" />
          <q-btn flat v-close-popup round dense icon="close" />
        </q-toolbar>
      </q-card-section>

      <q-card-section class="full-width">
        <slot name="content"></slot>
      </q-card-section>
    </q-card>
    <q-layout view="lhh LpR lff" container :style="styles" class="bg-secondary" v-else>
      <q-header class="bg-accent text-info header no-drag-region" v-if="!printing">
        <q-toolbar>
          <q-toolbar-title class="text-bold">
            <q-icon :name="icon" v-if="icon" />
            {{title}}
          </q-toolbar-title>
          <q-btn flat round dense icon="print" @click="onPrint" v-if="printable" />
          <q-btn flat round dense :icon="viewIcon" @click="onToggleView" v-if="toggleView" />
          <q-btn flat round dense :icon="positionIcon" @click="onTogglePosition" />
          <q-btn flat v-close-popup round dense icon="close" />
        </q-toolbar>
      </q-header>
      <q-page-container :class="{'print': printing}">
        <q-page class="bg-secondary" v-if="scrollable">
          <q-scroll-area class="o-page-container">
            <section>
              <slot name="content"></slot>
            </section>
          </q-scroll-area>
        </q-page>
        <section v-else>
          <slot name="content"></slot>
        </section>
      </q-page-container>
    </q-layout>
  </q-dialog>
</template>

<script setup lang="ts">
import {computed, onMounted, ref, watch, nextTick} from 'vue';

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  seamless: {
    type: Boolean,
    default: true
  },
  fullScreen: {
    type: Boolean,
    default: false
  },
  printable: {
    type: Boolean,
    default: false
  },
  toggleView: {
    type: Boolean,
    default: true
  },
  icon: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: 'Title'
  },
  position: {
    type: String,
    default: 'right' // standard, right
  },
  contentClass: {
    type: String,
    default: ''
  },
  contentStyle: {
    type: Object,
    default: function () {
      return { }
    }
  },
  actionVisible: {
    type: Boolean,
    default: false
  },
  confirmLabel: {
    type: String,
    default: ''
  },
  scrollable: {
    type: Boolean,
    default: false
  },
});
const emit = defineEmits(['confirm', 'close', 'show']);

const modal = ref();
const value = ref(true);
const positionAlt = ref('right');
const view = ref('normal');
const printing = ref(false);

function onConfirm() {
  emit('confirm', value.value);
}

function onBeforeShow () {
  positionAlt.value = props.position;
}

async function onPrint()  {
  printing.value = true;
  await nextTick();
  window.print();
  setTimeout(() => {
    printing.value = false;
  }, 10)
}

function onToggleView () {
  view.value = (view.value === 'normal') ? 'fullscreen' : 'normal';
}

function onTogglePosition () {
  positionAlt.value = (positionAlt.value === 'right') ? 'standard' : 'right';
  // this.setDialogPosition(positionAlt.value);
}

const maximized = computed(() => {
  return positionAlt.value === 'right' || view.value === 'fullscreen';
});

const positionIcon = computed(() => {
  return positionAlt.value === 'right' ? 'wysiwyg' : 'view_sidebar';
});

const viewIcon = computed(() => {
  return view.value === 'normal' ? 'fullscreen' : 'fullscreen_exit';
});

const styles = computed(() => {
  return view.value === 'normal' ? props.contentStyle : { width: '100vw' };
});

watch(
  () => props.show,
  (newValue) => {
    if (newValue) {
      view.value = props.fullScreen ? 'fullscreen' : 'normal';
      modal.value.show();
    } else {
      modal.value.hide();
    }
  }
)

onMounted(() => {
  if (props.show) {
    modal.value.show();
  }
})
</script>

<style lang="scss">
.o-side-dialog {
  .q-dialog__inner--standard {
    .dialog-card {
      .q-card__section {
        padding: 0;
      }

      .q-page {
        min-height: unset !important;
      }
    }
  }
  .q-dialog__inner--right {
    .q-layout-container {
      max-height: 100vh !important;
    }
  }

  .q-toolbar {
    min-height: 40px;

    .q-toolbar__title {
      font-size: 1rem;
    }

    .q-icon {
      font-size: 1.2rem;
    }
  }

  .q-tab-panel {
    padding: 16px 0;
  }

  .o-console-section {
    .console-header {
      border-bottom: solid 1px var(--q-accent);

      .console-toolbar {
        padding: 0 1rem;

        .btn-star, .btn-collapse, .btn-fullscreen {
          display: none;
        }
      }
    }
    .console-content {
      padding: 0;
    }
  }
}
</style>
