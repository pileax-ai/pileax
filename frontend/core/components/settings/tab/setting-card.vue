<template>
  <q-card class="bg-secondary fit setting-card" flat>
    <slot></slot>
  </q-card>
</template>

<script setup lang="ts">
defineProps({
  title: {
    type: String,
    default: ''
  }
});
</script>

<style lang="scss">
.setting-card {
  position: relative;
  padding: 0 1rem;

  .o-common-card {
    width: unset !important;
    min-width: unset !important;

    .o-common-item {
      min-height: 56px;
      .q-avatar {
        width: 28px !important;
        height: 48px !important;
      }
      .side-label .q-item__label {
        padding: 0!important;
      }
    }

    .sub-items {
      padding-left: 24px;
    }
  }

  .q-btn-group--rounded {
    border-radius: 4px;

    .q-btn:not(:first-child):not(:last-child) {
      border-left: solid 1px var(--q-dark);
    }
  }

}
</style>
