<template>
  <q-dialog ref="modal"
            class="o-command-dialog"
            :maximized="maximized"
            :position="position"
            @before-show="onBeforeShow"
            @show="$emit('show')"
            @hide="$emit('close')">
    <q-layout view="lhh LpR lff" container
              class="bg-secondary"
              :style="contentStyle">
      <q-header class="bg-secondary">
        <slot name="header"></slot>
      </q-header>
      <q-page-container>
        <q-page class="bg-secondary" v-if="scrollable">
          <q-scroll-area class="o-page-container">
            <section>
              <slot></slot>
            </section>
          </q-scroll-area>
        </q-page>
        <section v-else>
          <slot></slot>
        </section>
      </q-page-container>

      <q-footer class="bg-secondary">
        <slot name="footer"></slot>
      </q-footer>
    </q-layout>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  position: {
    type: String,
    default: 'standard'
  },
  maximized: {
    type: Boolean,
    default: false
  },
  contentStyle: {
    type: Object,
    default: function () {
      return {
        maxWidth: '755px',
        minHeight: '600px',
        marginTop: '60px'
      }
    }
  },
  seamless: {
    type: Boolean,
    default: true
  },
  scrollable: {
    type: Boolean,
    default: false
  },
})
const emit = defineEmits(['close', 'show'])
const modal = ref()

function onBeforeShow() {
  //
}

watch(
  () => props.show,
  (newValue) => {
    if (newValue) {
      modal.value.show()
    } else {
      modal.value.hide()
    }
  }
)

onMounted(() => {
  if (props.show) {
    modal.value.show()
  }
})
</script>

<style lang="scss">
.o-command-dialog {
  .q-header {
    padding: 0 1rem;
    border-bottom: solid 1px var(--q-dark);
  }

  .q-layout-container {
    border-radius: 1rem !important;
  }

  .q-footer {
    padding: 10px;
    border-top: solid 1px var(--q-dark);
  }

  kbd {
    color: var(--q-info);
    background: var(--q-accent);
  }
}
</style>
