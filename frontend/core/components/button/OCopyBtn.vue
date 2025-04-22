<template>
  <q-btn :icon="icon" @click="onCopy">
    <o-tooltip v-if="tooltip">
      {{tooltip}}
    </o-tooltip>
    <slot></slot>
  </q-btn>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import useCommon from 'core/hooks/useCommon';

const props = defineProps({
  tooltip: {
    type: String,
    default: ''
  },
  value: {
    type: String,
    default: ''
  },
  notify: {
    type: Boolean,
    default: false
  },
});

const icon = ref('content_copy');
const { copy } = useCommon();

function onCopy() {
  copy(props.value, props.notify);
  icon.value = 'done';
  setTimeout(() => {
    icon.value = 'content_copy';
  }, 1000)
}
</script>

<style lang="scss">
.o-copy-btn {
}
</style>
