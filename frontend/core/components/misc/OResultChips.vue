<template>
  <div class="row items-center o-result-chips">
    <q-chip class="bg-accent" square>
      <o-tooltip color="primary">Total</o-tooltip>
      <q-avatar icon="list" color="primary" text-color="white"></q-avatar>
      {{result.total || 0}}
    </q-chip>
    <q-chip class="bg-accent" square>
      <o-tooltip color="green">Success</o-tooltip>
      <q-avatar icon="done" color="green" text-color="white"></q-avatar>
      {{result.success || 0}}
    </q-chip>
    <q-chip class="bg-accent" square>
      <o-tooltip color="orange">Pending</o-tooltip>
      <q-avatar icon="pending" color="orange" text-color="white"></q-avatar>
      {{result.pending || 0}}
    </q-chip>
    <q-chip class="bg-accent" square>
      <o-tooltip color="red">Failed</o-tooltip>
      <q-avatar icon="close" color="red" text-color="white"></q-avatar>
      {{result.failed || 0}}
    </q-chip>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  result: {
    type: Object,
    default: function () {
      return {}
    }
  },
});

</script>

<style lang="scss">
.o-result-chips {
}
</style>
