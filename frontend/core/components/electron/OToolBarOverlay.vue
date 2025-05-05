<template>
  <div class="row items-center text-readable o-title-bar-overlay">
    <q-btn class="col-4" flat>
      <o-icon name="icon-fluent-minimize" />
    </q-btn>
    <q-btn class="col-4" flat>
      <o-icon name="icon-fluent-restore" />
    </q-btn>
    <q-btn class="col-4" flat>
      <o-icon name="icon-fluent-close" />
    </q-btn>
  </div>
</template>

<script setup lang="ts">
defineProps({
  link: {
    type: String,
    default: ''
  },
});

</script>

<style lang="scss">
.o-title-bar-overlay {
  display: none;
  width: 138px !important;
  min-height: 32px;
  .q-btn {
    height: 100%;
    min-height: 32px;
    padding: 0;
    border-radius: 0;

    .o-icon {
      width: 10px;
      height: 10px;
    }
  }
}

.electron:not(.platform-mac) {
  .o-title-bar-overlay {
    display: flex !important;
  }
}
</style>
