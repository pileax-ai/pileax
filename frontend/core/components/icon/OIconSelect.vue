<template>
  <o-hover-menu-btn class="o-icon-select"
                    :icon="icon"
                    anchor="bottom right"
                    self="top right"
                    menu-class="o-menu o-icon-select-menu"
                    min-width="240px"
                    :label="label"
                    :default-class="contentClass"
                    :round="round"
                    :offset="offset"
                    :enable-hover="enableHover" flat>
    <o-icon-select-view :size="80" @icon="onIcon" menu />
  </o-hover-menu-btn>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import OHoverMenuBtn from 'core/components/menu/OHoverMenuBtn.vue';
import OIconSelectView from 'components/icon/OIconSelectView.vue';

const props = defineProps({
  enableHover: {
    type: Boolean,
    default: false
  },
  round: {
    type: Boolean,
    default: false
  },
  showLabel: {
    type: Boolean,
    default: false
  },
  offset: {
    type: Array,
    default: function () {
      return [0, 8]
    }
  },
  label: {
    type: String,
    default: ''
  },
  contentClass: {
    type: String,
    default: ''
  },
});
const emit = defineEmits(['icon']);

const icon = ref('emoji_emotions');

function onIcon (value) {
  icon.value = value;
  emit('icon', value);
}
</script>

<style lang="scss">
.o-icon-select {
  min-width: 3rem;
  min-height: 3rem;
}

.o-icon-select-menu {
  max-width: 600px !important;
  height: 50vh !important;
}
</style>
