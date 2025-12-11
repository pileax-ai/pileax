<template>
  <section class="reader-setting-tab bg-secondary no-drag-region">
    <header class="row col-12 justify-center items-center">
      <span class="text-bold">
        {{ title }}
      </span>

      <section class="back text-tips">
        <q-btn icon="arrow_back" class="o-toolbar-btn" flat @click="emit('close')" />
      </section>
    </header>
    <q-scroll-area class="o-scroll-wrapper">
      <slot></slot>
    </q-scroll-area>
  </section>
</template>

<script setup lang="ts">
defineProps({
  title: {
    type: String,
    default: ''
  }
})
const emit = defineEmits(['close'])
</script>

<style lang="scss">
.reader-setting-tab {
  header {
    border-bottom: solid 1px var(--q-accent);

    .back {
      position: absolute;
      left: 10px;
    }
  }

  .o-scroll-wrapper {
    .q-list {
      padding: 1rem !important;

      .q-item {
        padding: 8px;
        border-radius: 4px;

        &:not(:first-child) {
          margin-top: 1rem;
        }
      }
    }
  }
}
</style>
